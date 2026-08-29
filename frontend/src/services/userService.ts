import apiClient from './api';
import { IUser } from '../types/api';

export interface IUserItem {
  id: string;
  phone: string;
  fullName: string;
  userType: 'citizen' | 'officer' | 'admin';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  village?: { id: string; code: string; name: string } | null;
  organization?: { id: string; code: string; name: string; type?: string } | null;
}

export interface IUsersResponse {
  items: IUserItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export const userService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    userType?: 'citizen' | 'officer' | 'admin';
    isActive?: boolean;
    villageId?: string;
    organizationId?: string;
  }): Promise<IUsersResponse> {
    try {
      const res = await apiClient.get('/users', { params });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getUsers failed', e);
    }
    return {
      items: [],
      pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0 }
    };
  },

  async getUserDetail(id: string): Promise<IUserItem | null> {
    try {
      const res = await apiClient.get(`/users/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getUserDetail failed', e);
    }
    return null;
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      await apiClient.patch(`/users/${id}/status`, { isActive });
      return true;
    } catch (e) {
      console.warn('API toggleUserStatus failed', e);
      return false;
    }
  },

  async updateUserRole(id: string, data: { userType: 'citizen' | 'officer' | 'admin'; organizationId?: string | null }): Promise<IUserItem | null> {
    try {
      const res = await apiClient.patch(`/users/${id}/role`, data);
      return res.data?.data || null;
    } catch (e) {
      console.warn('API updateUserRole failed', e);
      throw e;
    }
  }
};
