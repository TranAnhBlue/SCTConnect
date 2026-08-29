import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types/api';
import { authService } from '../services/authService';

export interface RegisterPayload {
  fullName: string;
  phone: string;
  villageId: string;
  password: string;
  confirmPassword: string;
  organizationId?: string | null;
}

interface AuthContextType {
  user: IUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<IUser>) => void;
}

const DEFAULT_GUEST_USER: IUser = {
  id: 'guest',
  fullName: 'Công dân',
  phone: '',
  role: 'citizen',
  userType: 'citizen',
  titleName: 'Công dân'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser>(() => {
    const saved = localStorage.getItem('sct_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_GUEST_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sct_token') || null;
  });

  useEffect(() => {
    if (user && user.id !== 'guest') {
      localStorage.setItem('sct_user', JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem('sct_token', token);
    }
  }, [user, token]);

  const login = async (phone: string, password: string) => {
    const result = await authService.login(phone, password);
    setUser(result.user);
    setToken(result.token);
  };

  const register = async (data: RegisterPayload) => {
    const result = await authService.register(data);
    setUser(result.user);
    setToken(result.token);
  };

  const logout = () => {
    authService.logout();
    setUser(DEFAULT_GUEST_USER);
    setToken(null);
  };

  const updateCurrentUser = (updates: Partial<IUser>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && user.id !== 'guest',
        login,
        register,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
