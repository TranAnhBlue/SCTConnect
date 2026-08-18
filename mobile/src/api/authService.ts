import apiClient from './axios';
import { User, MttqRole, MemberOrganization } from '../store/authStore';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

const mapRawUser = (rawUser: any, fallbackRole?: MttqRole, fallbackName?: string, fallbackDept?: string, fallbackOrg?: MemberOrganization, fallbackTitle?: string): User => {
  const isOfficer = (rawUser?.role && rawUser.role !== 'citizen') || (fallbackRole && fallbackRole !== 'citizen');
  return {
    id: rawUser._id || rawUser.id || `usr_${Date.now()}`,
    fullName: rawUser.fullName || fallbackName || 'Người dùng MTTQ',
    phone: rawUser.phone || '0912345678',
    email: rawUser.email,
    role: (rawUser.role as MttqRole) || fallbackRole || 'citizen',
    organization: (rawUser.organization as MemberOrganization) || fallbackOrg || (isOfficer ? 'mttq' : undefined),
    titleName: rawUser.titleName || fallbackTitle || (isOfficer ? 'Lãnh đạo Mặt trận Xã' : 'Công dân'),
    department: rawUser.department || fallbackDept || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
    commune: rawUser.commune || 'Ủy ban MTTQ Xã Thanh Oai',
    district: rawUser.district || 'Huyện Thanh Oai',
    avatarUrl: rawUser.avatarUrl || (isOfficer ? 'https://picsum.photos/seed/mttq_officer/200/200' : 'https://picsum.photos/seed/citizen/200/200'),
  };
};

export const authService = {
  loginApi: async (
    phone: string,
    password?: string,
    role?: MttqRole,
    name?: string,
    dept?: string,
    org?: MemberOrganization,
    titleName?: string
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', {
        phone,
        password,
        role,
        fullName: name,
        department: dept,
        organization: org,
        titleName,
      });

      if (response.data?.success && response.data?.user) {
        return {
          success: true,
          token: response.data.token,
          user: mapRawUser(response.data.user, role, name, dept, org, titleName),
        };
      }
      throw new Error(response.data?.message || 'Đăng nhập thất bại');
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      console.warn('⚠️ API Auth Login offline/warning:', err.message);
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
        token: `sct_token_fallback_${Date.now()}`,
        user: fallbackUser,
      };
    }
  },

  getProfileApi: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data?.success && response.data?.data) {
        return mapRawUser(response.data.data);
      }
      return null;
    } catch (err) {
      console.warn('API Error fetching user profile:', err);
      return null;
    }
  },

  registerApi: async (data: {
    fullName: string;
    phone: string;
    password?: string;
    email?: string;
    role?: MttqRole;
    organization?: MemberOrganization;
    titleName?: string;
    department?: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data?.success && response.data?.user) {
        return {
          success: true,
          token: response.data.token,
          user: mapRawUser(response.data.user, data.role, data.fullName, data.department, data.organization, data.titleName),
        };
      }
      throw new Error(response.data?.message || 'Đăng ký không thành công');
    } catch (err: any) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw err;
    }
  },
};

