import axios from 'axios';

// Live API URL or local backend fallback
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  'https://tarantula-culinary-preschool.ngrok-free.dev/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Inject Auth Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sct_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
