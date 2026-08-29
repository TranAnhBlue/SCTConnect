import apiClient from './api';
import { IUser, UserRole } from '../types/api';

// Map userType to a display-friendly role
function mapUserTypeToRole(userType: string): UserRole {
  if (userType === 'admin') return 'mttq_president';
  if (userType === 'officer') return 'mttq_officer';
  return 'citizen';
}

function mapProfileToUser(raw: any): IUser {
  return {
    id: raw.id,
    fullName: raw.fullName,
    phone: raw.phone,
    role: mapUserTypeToRole(raw.userType),
    userType: raw.userType,
    villageId: raw.villageId || null,
    village: raw.village || null,
    organizationId: raw.organizationId || null,
    organization: raw.organization || null,
    titleName:
      raw.userType === 'admin'
        ? 'Quản trị viên Toàn Xã'
        : raw.userType === 'officer'
        ? raw.organization?.name || 'Cán bộ cơ sở'
        : 'Công dân',
    department:
      raw.userType === 'admin'
        ? 'Ủy ban MTTQ Xã'
        : raw.organization?.name || raw.village?.name || '',
    isActive: raw.isActive,
    lastLoginAt: raw.lastLoginAt || null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt
  };
}

export const authService = {
  async login(phone: string, password: string): Promise<{ user: IUser; token: string }> {
    const res = await apiClient.post('/auth/login', { phone, password });
    const resData = res.data?.data;
    if (!resData?.user) {
      throw new Error(res.data?.message || 'Đăng nhập thất bại');
    }

    const token = resData.tokens?.accessToken;
    if (!token) throw new Error('Không nhận được mã xác thực (Token)');

    if (resData.tokens?.refreshToken) {
      localStorage.setItem('sct_refresh_token', resData.tokens.refreshToken);
    }

    return { user: mapProfileToUser(resData.user), token };
  },

  async register(data: {
    fullName: string;
    phone: string;
    villageId: string;
    password: string;
    confirmPassword: string;
    organizationId?: string | null;
  }): Promise<{ user: IUser; token: string }> {
    const res = await apiClient.post('/auth/register', {
      phone: data.phone,
      fullName: data.fullName,
      villageId: data.villageId,
      password: data.password,
      confirmPassword: data.confirmPassword,
      organizationId: data.organizationId || undefined
    });

    const resData = res.data?.data;
    if (!resData?.user) {
      throw new Error(res.data?.message || 'Đăng ký thất bại');
    }

    const token = resData.tokens?.accessToken;
    if (!token) throw new Error('Không nhận được mã xác thực (Token)');

    if (resData.tokens?.refreshToken) {
      localStorage.setItem('sct_refresh_token', resData.tokens.refreshToken);
    }

    return { user: mapProfileToUser(resData.user), token };
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('sct_refresh_token');
    if (!refreshToken) return null;

    try {
      const res = await apiClient.post('/auth/refresh-token', { refreshToken });
      const tokens = res.data?.data;
      if (tokens?.accessToken) {
        localStorage.setItem('sct_token', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('sct_refresh_token', tokens.refreshToken);
        }
        return tokens.accessToken;
      }
    } catch {
      localStorage.removeItem('sct_token');
      localStorage.removeItem('sct_refresh_token');
    }
    return null;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('sct_user');
    localStorage.removeItem('sct_token');
    localStorage.removeItem('sct_refresh_token');
  },

  async getProfile(): Promise<IUser | null> {
    try {
      const res = await apiClient.get('/auth/me');
      const raw = res.data?.data;
      if (raw) return mapProfileToUser(raw);
    } catch (e) {
      console.error('Lỗi khi lấy thông tin hồ sơ', e);
    }
    return null;
  },

  async updateProfile(data: {
    fullName?: string;
    villageId?: string;
    organizationId?: string | null;
  }): Promise<IUser | null> {
    const res = await apiClient.patch('/auth/profile', data);
    const raw = res.data?.data;
    if (raw) return mapProfileToUser(raw);
    return null;
  },

  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.patch('/auth/change-password', data);
    return res.data?.data || { success: true, message: 'Đổi mật khẩu thành công' };
  }
};
