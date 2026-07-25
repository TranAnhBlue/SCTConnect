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
    const isOfficer = role !== 'citizen';
    const mockUser: User = {
      id: isOfficer ? `officer_${role}` : 'citizen_1',
      fullName: name || (isOfficer ? 'Nguyễn Văn Minh' : 'Trần Anh'),
      phone: phone || '0988123456',
      role,
      organization: org || (isOfficer ? 'mttq' : undefined),
      titleName: titleName || (isOfficer ? 'Phó Chủ tịch Ủy ban MTTQ Xã' : 'Công dân'),
      department: dept || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
      commune: 'Ủy ban MTTQ Xã Thanh Oai',
      district: 'Huyện Thanh Oai',
      avatarUrl: isOfficer ? 'https://picsum.photos/seed/mttq_officer/200/200' : 'https://picsum.photos/seed/citizen/200/200',
    };

    set({
      isAuthenticated: true,
      user: mockUser,
      token: 'sctconnect-jwt-token-mttq-2026',
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));

