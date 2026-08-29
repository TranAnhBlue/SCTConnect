import apiClient from './api';
import { ICategory } from '../types/api';

export const categoryService = {
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
  }
};
