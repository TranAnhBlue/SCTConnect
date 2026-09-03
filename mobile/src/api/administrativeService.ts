import apiClient from './axios';
import { IVillage, ICategory, IOrganization } from '../types/api';

export const administrativeService = {
  // Lấy danh sách thôn / tổ dân phố
  async getVillages(search?: string): Promise<IVillage[]> {
    try {
      const res = await apiClient.get('/villages', { params: search ? { search } : undefined });
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
    } catch (e) {
      console.warn('API getVillages failed', e);
    }
    return [];
  },

  // Lấy danh sách lĩnh vực kiến nghị
  async getCategories(search?: string): Promise<ICategory[]> {
    try {
      const res = await apiClient.get('/categories', { params: search ? { search } : undefined });
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
    } catch (e) {
      console.warn('API getCategories failed', e);
    }
    return [];
  },

  // Lấy danh sách hội đoàn / tổ chức tiếp nhận
  async getOrganizations(params?: { search?: string; type?: string }): Promise<IOrganization[]> {
    try {
      const res = await apiClient.get('/organizations', { params });
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
    } catch (e) {
      console.warn('API getOrganizations failed', e);
    }
    return [];
  },
};
