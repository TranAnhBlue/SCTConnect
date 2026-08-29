import apiClient from './api';
import { IOrganization } from '../types/api';

export const organizationService = {
  async getList(params?: { search?: string; type?: string; isActive?: boolean }): Promise<IOrganization[]> {
    try {
      const res = await apiClient.get('/organizations', { params });
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
    } catch (e) {
      console.warn('API getList organizations failed', e);
    }
    return [];
  },

  async getTree(): Promise<IOrganization[]> {
    try {
      const res = await apiClient.get('/organizations/tree');
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
    } catch (e) {
      console.warn('API getTree failed', e);
    }
    return [];
  },

  async create(data: { code: string; name: string; type?: string }): Promise<IOrganization> {
    const res = await apiClient.post('/organizations', data);
    return res.data?.data;
  },

  async update(id: string, data: { name?: string; type?: string; isActive?: boolean }): Promise<IOrganization> {
    const res = await apiClient.patch(`/organizations/${id}`, data);
    return res.data?.data;
  }
};
