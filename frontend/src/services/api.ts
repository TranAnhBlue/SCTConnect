import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Live API URL or local backend fallback
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  'http://localhost:3036/api/v1';

// System Key configuration
const SYSTEM_KEY =
  (import.meta as any).env?.VITE_SYSTEM_KEY ||
  'sctconnect_system_secure_key_2026';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'x-system-key': SYSTEM_KEY
  }
});

// Request Interceptor: Tự động đính kèm Access Token & System Key
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sct_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (SYSTEM_KEY) {
    config.headers['x-system-key'] = SYSTEM_KEY;
  }
  return config;
});

// =========================================================================
// RESPONSE INTERCEPTOR: TỰ ĐỘNG LÀM MỚI TOKEN (SILENT REFRESH TOKEN)
// Khi Access Token hết hạn sau 15 phút (HTTP 401), hệ thống sẽ:
// 1. Tự động dùng Refresh Token gọi /auth/refresh-token lấy cặp Token mới
// 2. Lưu token mới vào localStorage
// 3. Thực hiện lại request vừa bị lỗi mà người dùng không hề bị gián đoạn hay văng ra
// 4. Nếu có nhiều request cùng lúc bị 401, xếp hàng (queue) chờ lấy token mới xong rồi chạy tiếp
// =========================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bỏ qua nếu không có response hoặc không phải lỗi 401
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Tránh vòng lặp vô tận nếu chính endpoint refresh-token hoặc login bị 401
    const requestUrl = originalRequest.url || '';
    if (
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/refresh-token') ||
      requestUrl.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    // Nếu request này đã từng được retry một lần rồi mà vẫn 401
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Đánh dấu request này đang retry
    originalRequest._retry = true;

    // Nếu đang có một request khác thực hiện refresh token, xếp request này vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    const currentRefreshToken = localStorage.getItem('sct_refresh_token');
    if (!currentRefreshToken) {
      isRefreshing = false;
      // Không có refresh token -> xóa phiên và chuyển hướng về đăng nhập
      handleLogoutAndRedirect();
      return Promise.reject(error);
    }

    try {
      // Dùng axios thuần (không qua apiClient để tránh bị dính interceptor)
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        { refreshToken: currentRefreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-system-key': SYSTEM_KEY
          }
        }
      );

      const tokens = refreshResponse.data?.data;
      const newAccessToken = tokens?.accessToken;
      const newRefreshToken = tokens?.refreshToken;

      if (!newAccessToken) {
        throw new Error('Không nhận được Access Token mới');
      }

      // Lưu token mới
      localStorage.setItem('sct_token', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('sct_refresh_token', newRefreshToken);
      }

      // Cập nhật token cho request hiện tại và các request đang chờ
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

      // Thực thi lại request ban đầu với token mới
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      // Refresh Token cũng đã hết hạn hoặc không hợp lệ -> Đăng xuất
      handleLogoutAndRedirect();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

function handleLogoutAndRedirect() {
  localStorage.removeItem('sct_user');
  localStorage.removeItem('sct_token');
  localStorage.removeItem('sct_refresh_token');

  // Chỉ redirect nếu người dùng đang ở trong khu vực portal
  if (window.location.pathname.startsWith('/portal')) {
    window.location.href = '/login?session_expired=true';
  }
}

export default apiClient;
