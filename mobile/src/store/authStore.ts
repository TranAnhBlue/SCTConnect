import { create } from 'zustand';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'citizen' | 'officer' | 'admin';
  department?: string;
  commune: string;
  district: string;
  avatarUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  login: (phone: string, password?: string, role?: 'citizen' | 'officer' | 'admin', name?: string, dept?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: async (phone: string, password = '', role: 'citizen' | 'officer' | 'admin' = 'citizen', name?: string, dept?: string) => {
    const isOfficer = role === 'officer' || role === 'admin';
    const mockUser: User = {
      id: isOfficer ? 'officer_1' : 'citizen_1',
      fullName: name || (isOfficer ? 'Nguyễn Văn Minh (Cán bộ Xã)' : 'Trần Anh (Công dân)'),
      phone: phone || (isOfficer ? '0988123456' : '0912345678'),
      role,
      department: isOfficer ? (dept || 'Bộ phận Địa chính - Xây dựng & Đô thị') : undefined,
      commune: 'UBND Xã Thanh Oai',
      district: 'Huyện Thanh Oai',
      avatarUrl: isOfficer ? 'https://picsum.photos/seed/officer/200/200' : 'https://picsum.photos/seed/citizen/200/200',
    };

    set({
      isAuthenticated: true,
      user: mockUser,
      token: 'sctconnect-jwt-token-2026',
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));

