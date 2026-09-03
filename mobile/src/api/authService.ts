import apiClient, { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY } from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../types/api';

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: IUser;
  message?: string;
}

export const authService = {
  loginApi: async (phone: string, password?: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', {
        phone,
        password,
      });

      const data = response.data?.data || response.data;
      const token = data?.token;
      const refreshToken = data?.refreshToken;
      const user = data?.user;

      if (token && user) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));

        return {
          success: true,
          token,
          refreshToken,
          user,
        };
      }
      throw new Error(response.data?.message || 'Đăng nhập thất bại');
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  getProfileApi: async (): Promise<IUser | null> => {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data?.data || response.data;
      if (user?.id) {
        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch (err) {
      console.warn('API Error fetching user profile:', err);
      // Fallback từ local storage nếu đang offline
      const stored = await AsyncStorage.getItem(USER_INFO_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
      return null;
    }
  },

  registerApi: async (data: {
    fullName: string;
    phone: string;
    password?: string;
    villageId?: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/register', data);
      const resData = response.data?.data || response.data;
      const token = resData?.token;
      const refreshToken = resData?.refreshToken;
      const user = resData?.user;

      if (token && user) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        if (refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(user));

        return {
          success: true,
          token,
          refreshToken,
          user,
        };
      }
      throw new Error(response.data?.message || 'Đăng ký không thành công');
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },

  logoutApi: async (): Promise<void> => {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_INFO_KEY]);
  },
};
