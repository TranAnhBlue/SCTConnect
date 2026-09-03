import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = '@sctconnect_auth_token';
export const REFRESH_TOKEN_KEY = '@sctconnect_refresh_token';
export const USER_INFO_KEY = '@sctconnect_user_info';
export const SYSTEM_KEY = 'sctconnect_system_secure_key_2026';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Lấy IP từ bundler connection của Expo
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost ||
    (Constants.manifest as any)?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3036/api/v1`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3036/api/v1';
  }

  return 'http://localhost:3036/api/v1';
};

export const API_BASE_URL = getBaseUrl();
console.log('📡 Mobile connected API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-system-key': SYSTEM_KEY,
  },
});

// Request interceptor: Tự động đính kèm Bearer Token & System Key
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (SYSTEM_KEY) {
        config.headers['x-system-key'] = SYSTEM_KEY;
      }
    } catch (e) {
      console.warn('Error attaching auth token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Silent refresh token khi gặp 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
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
  async (error) => {
    const originalRequest = error.config;

    // Không thử refresh nếu chính request refresh-token hoặc login/register bị 401
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-system-key': SYSTEM_KEY,
            },
          }
        );

        const newAccessToken = refreshRes.data?.data?.token || refreshRes.data?.token;
        const newRefreshToken = refreshRes.data?.data?.refreshToken || refreshRes.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('Refresh token returned empty access token');
        }

        await AsyncStorage.setItem(AUTH_TOKEN_KEY, newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY]);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
