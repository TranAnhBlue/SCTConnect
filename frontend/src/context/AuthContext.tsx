import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, UserRole } from '../types/api';
import { MOCK_USERS } from '../services/mockData';
import { authService } from '../services/authService';

export interface RegisterPayload {
  fullName: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  role?: UserRole;
  email?: string;
}

interface AuthContextType {
  user: IUser;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, password?: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser>(() => {
    const saved = localStorage.getItem('sct_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    // Default to MTTQ President for complete access to admin & workflow
    return MOCK_USERS[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sct_token') || 'mock-jwt-token-sct';
  });

  useEffect(() => {
    localStorage.setItem('sct_user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('sct_token', token);
    }
  }, [user, token]);

  const login = async (phone: string, password = 'Password@123') => {
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
    localStorage.removeItem('sct_user');
    localStorage.removeItem('sct_token');
    setUser(MOCK_USERS[4]); // Fallback to citizen role
    setToken(null);
  };

  const switchRole = (role: UserRole) => {
    const target = MOCK_USERS.find(u => u.role === role) || {
      ...user,
      role,
      titleName: role === 'citizen' ? 'Công dân' : 'Cán bộ'
    };
    setUser(target);
  };

  const updateCurrentUser = (updates: Partial<IUser>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
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
