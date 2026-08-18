import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/authService';

const AUTH_TOKEN_KEY = '@sctconnect_auth_token';

export type MttqRole =
  | 'citizen'
  | 'officer'
  | 'admin'
  | 'mttq_president'
  | 'youth_leader'
  | 'women_leader'
  | 'veteran_leader'
  | 'union_leader'
  | 'farmer_leader';

export type MemberOrganization =
  | 'mttq'
  | 'youth'
  | 'women'
  | 'veterans'
  | 'union'
  | 'farmers';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: MttqRole;
  organization?: MemberOrganization;
  titleName?: string;
  department?: string;
  commune: string;
  district: string;
  avatarUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isInitializing: boolean;

  initAuth: () => Promise<void>;
  login: (
    phone: string,
    password?: string,
    role?: MttqRole,
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ) => Promise<void>;
  register: (data: {
    fullName: string;
    phone: string;
    password?: string;
    email?: string;
    role?: MttqRole;
    organization?: MemberOrganization;
    titleName?: string;
    department?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
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
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
          set({ token: null, isAuthenticated: false, user: null });
        }
      }
    } catch (e) {
      console.warn('Error initializing auth state:', e);
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (
    phone: string,
    password = '',
    role: MttqRole = 'citizen',
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ) => {
    const res = await authService.loginApi(phone, password, role, name, dept, org, titleName);
    if (res.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, res.token);
    }
    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
    });
  },

  register: async (data) => {
    const res = await authService.registerApi(data);
    if (res.token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, res.token);
    }
    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
    });
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.warn('Error clearing auth token:', e);
    }
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
