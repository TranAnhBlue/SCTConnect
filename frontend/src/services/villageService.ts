import apiClient from './api';
import { IVillage } from '../types/api';

export const villageService = {
  async getVillages(search?: string): Promise<IVillage[]> {
    try {
      const res = await apiClient.get('/villages', { params: search ? { search } : undefined });
      const d = res.data;
      // Unwrap all possible shapes
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.data)) return d.data;
      if (Array.isArray(d?.data?.root)) return d.data.root;
      if (Array.isArray(d?.data?.items)) return d.data.items;
      if (Array.isArray(d?.items)) return d.items;
      if (Array.isArray(d?.root)) return d.root;
    } catch (e) {
      console.warn('API getVillages failed', e);
    }
    return [];
  }
};
