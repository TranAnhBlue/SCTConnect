import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,

  login: async (phone: string, password: string) => {
    // TODO: replace with real API call
    // const { data } = await apiClient.post('/auth/login', { phone, password });
    // set({ isAuthenticated: true, user: data.user, token: data.token });
    set({
      isAuthenticated: true,
      user: { id: '1', name: 'Người dùng', phone },
      token: 'mock-token',
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
