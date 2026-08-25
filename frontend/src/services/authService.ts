import apiClient from './api';
import { IUser, UserRole } from '../types/api';
import { MOCK_USERS } from './mockData';

export const authService = {
  async login(phone: string, password = 'Password@123'): Promise<{ user: IUser; token: string }> {
    try {
      const res = await apiClient.post('/auth/login', { phone, password });
      const resData = res.data?.data;
      if (resData?.user) {
        const rawUser = resData.user;
        const activeOrg = resData.activeOrganization;
        const token = resData.tokens?.accessToken || resData.token || 'mock-jwt-token-sct';

        // Map backend user to Frontend IUser
        let role: UserRole = 'citizen';
        if (rawUser.userType === 'officer' || activeOrg) {
          const orgCode = activeOrg?.orgCode || '';
          if (orgCode.includes('youth')) role = 'youth_leader';
          else if (orgCode.includes('women')) role = 'women_leader';
          else if (orgCode.includes('veteran')) role = 'veteran_leader';
          else if (orgCode.includes('mttq')) role = 'mttq_president';
          else role = 'mttq_officer';
        }

        const normalizedUser: IUser = {
          id: rawUser.id,
          fullName: rawUser.fullName,
          phone: rawUser.phone,
          email: rawUser.email || `${rawUser.phone}@sctconnect.vn`,
          role: role,
          userType: rawUser.userType || (role === 'citizen' ? 'citizen' : 'officer'),
          titleName: activeOrg?.titleName || (role === 'citizen' ? 'Công dân' : 'Cán bộ cơ sở'),
          department: activeOrg?.orgName || 'Ủy ban Mặt trận Tổ quốc Xã Thanh Oai',
          commune: 'Xã Thanh Oai',
          district: 'Huyện Thanh Oai',
          avatarUrl: rawUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          activeOrganization: activeOrg,
          organizations: resData.organizations,
          permissions: resData.permissions,
          isVerified: true
        };

        return { user: normalizedUser, token };
      }
    } catch (e) {
      console.warn('API login failed, using fallback mock user', e);
    }

    // Fallback search in mock users
    const found = MOCK_USERS.find(u => u.phone === phone) || MOCK_USERS[0];
    return {
      user: found,
      token: 'mock-jwt-token-sct'
    };
  },

  async register(data: {
    fullName: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
    role?: UserRole;
    email?: string;
  }): Promise<{ user: IUser; token: string }> {
    const password = data.password || 'Password@123';
    const confirmPassword = data.confirmPassword || password;

    try {
      const res = await apiClient.post('/auth/register', {
        phone: data.phone,
        fullName: data.fullName,
        password,
        confirmPassword
      });

      const resData = res.data?.data;
      if (resData?.user) {
        const rawUser = resData.user;
        const token = resData.tokens?.accessToken || resData.token || 'mock-jwt-token-sct';

        const newUser: IUser = {
          id: rawUser.id,
          fullName: rawUser.fullName,
          phone: rawUser.phone,
          email: data.email || `${rawUser.phone}@sctconnect.vn`,
          role: data.role || 'citizen',
          userType: rawUser.userType || 'citizen',
          titleName: data.role === 'citizen' ? 'Công dân' : 'Cán bộ',
          department: 'Xã Thanh Oai',
          commune: 'Xã Thanh Oai',
          district: 'Huyện Thanh Oai',
          isVerified: true
        };

        return { user: newUser, token };
      }
    } catch (e) {
      console.warn('API register failed, using fallback mock user', e);
    }

    const newUser: IUser = {
      id: `u-${Date.now()}`,
      fullName: data.fullName || 'Công dân mới',
      phone: data.phone || '0988123456',
      email: data.email || 'user@sctconnect.vn',
      role: data.role || 'citizen',
      userType: 'citizen',
      titleName: 'Công dân',
      department: 'Xã Thanh Oai',
      commune: 'Xã Thanh Oai',
      district: 'Huyện Thanh Oai',
      isVerified: true
    };

    return {
      user: newUser,
      token: 'mock-jwt-token-sct'
    };
  },

  async getProfile(): Promise<IUser> {
    try {
      const res = await apiClient.get('/auth/me');
      const resData = res.data?.data;
      if (resData) {
        const activeOrg = resData.activeOrganization;
        let role: UserRole = 'citizen';
        if (resData.userType === 'officer' || activeOrg) {
          const orgCode = activeOrg?.orgCode || '';
          if (orgCode.includes('youth')) role = 'youth_leader';
          else if (orgCode.includes('women')) role = 'women_leader';
          else if (orgCode.includes('veteran')) role = 'veteran_leader';
          else if (orgCode.includes('mttq')) role = 'mttq_president';
          else role = 'mttq_officer';
        }

        return {
          id: resData.id,
          fullName: resData.fullName,
          phone: resData.phone,
          email: `${resData.phone}@sctconnect.vn`,
          role,
          userType: resData.userType,
          titleName: activeOrg?.titleName || (role === 'citizen' ? 'Công dân' : 'Cán bộ cơ sở'),
          department: activeOrg?.orgName || 'Ủy ban MTTQ Xã Thanh Oai',
          commune: 'Xã Thanh Oai',
          district: 'Huyện Thanh Oai',
          avatarUrl: resData.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          activeOrganization: activeOrg,
          organizations: resData.organizations,
          permissions: resData.permissions,
          isVerified: true
        };
      }
    } catch (e) {
      console.warn('API getProfile failed, using fallback', e);
    }
    return MOCK_USERS[0];
  },

  async updateProfile(id: string, updates: Partial<IUser>): Promise<IUser> {
    try {
      const res = await apiClient.put(`/auth/profile/${id}`, updates);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API updateProfile failed, using fallback', e);
    }
    return { ...MOCK_USERS[0], ...updates };
  }
};
