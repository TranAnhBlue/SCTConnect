import { create } from 'zustand';

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

  login: (
    phone: string,
    password?: string,
    role?: MttqRole,
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

import { authService } from '../api/authService';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: async (
    phone: string,
    password = '',
    role: MttqRole = 'citizen',
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ) => {
    const res = await authService.loginApi(phone, role, name, dept, org, titleName);
    set({
      isAuthenticated: true,
      user: res.user,
      token: res.token,
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));

