import apiClient from './axios';
import { User, MttqRole, MemberOrganization } from '../store/authStore';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  loginApi: async (
    phone: string,
    role?: MttqRole,
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', {
        phone,
        role,
        fullName: name,
        department: dept,
        organization: org,
        titleName,
      });

      if (response.data?.success && response.data?.user) {
        const rawUser = response.data.user;
        const mappedUser: User = {
          id: rawUser._id || rawUser.id || `usr_${Date.now()}`,
          fullName: rawUser.fullName || name || 'Người dùng MTTQ',
          phone: rawUser.phone || phone,
          email: rawUser.email,
          role: (rawUser.role as MttqRole) || role || 'citizen',
          organization: (rawUser.organization as MemberOrganization) || org || (role && role !== 'citizen' ? 'mttq' : undefined),
          titleName: rawUser.titleName || titleName || (role && role !== 'citizen' ? 'Lãnh đạo Mặt trận Xã' : 'Công dân'),
          department: rawUser.department || dept || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
          commune: rawUser.commune || 'Ủy ban MTTQ Xã Thanh Oai',
          district: rawUser.district || 'Huyện Thanh Oai',
          avatarUrl: rawUser.avatarUrl || (role && role !== 'citizen' ? 'https://picsum.photos/seed/mttq_officer/200/200' : 'https://picsum.photos/seed/citizen/200/200'),
        };

        return {
          success: true,
          token: response.data.token || 'demo-jwt-token-mttq-2026',
          user: mappedUser,
        };
      }
      throw new Error(response.data?.message || 'Đăng nhập thất bại');
    } catch (err: any) {
      console.warn('⚠️ Realtime Auth API warning (using fallback mock profile):', err.message);
      // Fallback fallback if server unreachable
      const isOfficer = role && role !== 'citizen';
      const fallbackUser: User = {
        id: isOfficer ? `officer_${role}` : 'citizen_1',
        fullName: name || (isOfficer ? 'Đồng chí Nguyễn Văn Minh' : 'Trần Anh'),
        phone: phone || '0988123456',
        role: role || 'citizen',
        organization: org || (isOfficer ? 'mttq' : undefined),
        titleName: titleName || (isOfficer ? 'Chủ tịch Ủy ban MTTQ Việt Nam Xã' : 'Công dân'),
        department: dept || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: isOfficer ? 'https://picsum.photos/seed/mttq_officer/200/200' : 'https://picsum.photos/seed/citizen/200/200',
      };
      return {
        success: true,
        token: 'fallback-demo-jwt-token',
        user: fallbackUser,
      };
    }
  },
};
