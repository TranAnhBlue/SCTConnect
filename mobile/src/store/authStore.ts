import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/authService';
import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../api/axios';
import { IUser } from '../types/api';

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  isInitializing: boolean;

  initAuth: () => Promise<void>;
  login: (phone: string, password?: string) => Promise<void>;
  register: (data: {
    fullName: string;
    phone: string;
    password?: string;
    villageId?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isInitializing: true,

  initAuth: async () => {
    try {
      const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        set({ token: savedToken });
        const fetchedUser = await authService.getProfileApi();
        if (fetchedUser) {
          set({ isAuthenticated: true, user: fetchedUser });
        } else {
          // Kiểm tra xem có cache user info offline không
          const cachedUser = await AsyncStorage.getItem(USER_INFO_KEY);
          if (cachedUser) {
            set({ isAuthenticated: true, user: JSON.parse(cachedUser) });
          } else {
            set({ token: null, isAuthenticated: false, user: null });
          }
        }
      }
    } catch (e) {
      console.warn('Error initializing auth state:', e);
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (phone: string, password = '') => {
    const res = await authService.loginApi(phone, password);
    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
    });
  },

  register: async (data) => {
    const res = await authService.registerApi(data);
    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
    });
  },

  logout: async () => {
    try {
      await authService.logoutApi();
    } catch (e) {
      console.warn('Error clearing auth token:', e);
    }
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
