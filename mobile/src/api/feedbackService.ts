import apiClient from './axios';
import { IFeedback, IPaginatedFeedbacks, IFeedbackStatistics, ICreateFeedbackPayload } from '../types/api';

export interface IFeedbackFilters {
  page?: number;
  limit?: number;
  search?: string;
  targetOrganizationId?: string;
  incidentVillageId?: string;
  categoryId?: string;
  status?: 'pending' | 'received' | 'rejected';
}

export const feedbackService = {
  // Công dân gửi phản ánh mới
  async createFeedback(payload: ICreateFeedbackPayload): Promise<IFeedback> {
    const res = await apiClient.post('/feedbacks', payload);
    return res.data?.data || res.data;
  },

  // Công dân xem danh sách phản ánh của mình
  async getMyFeedbacks(filters?: IFeedbackFilters): Promise<IPaginatedFeedbacks> {
    try {
      const res = await apiClient.get('/feedbacks/me', { params: filters });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getMyFeedbacks failed', e);
    }
    return { items: [], pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0 } };
  },

  // Công dân xem chi tiết phản ánh của mình
  async getMyFeedbackById(id: string): Promise<IFeedback | null> {
    try {
      const res = await apiClient.get(`/feedbacks/me/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API getMyFeedbackById ${id} failed`, e);
    }
    return null;
  },

  // Cán bộ / Lãnh đạo xem toàn bộ danh sách phản ánh
  async getOfficerFeedbacks(filters?: IFeedbackFilters): Promise<IPaginatedFeedbacks> {
    try {
      const res = await apiClient.get('/feedbacks', { params: filters });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getOfficerFeedbacks failed', e);
    }
    return { items: [], pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0 } };
  },

  // Cán bộ xem chi tiết phản ánh bất kỳ
  async getOfficerFeedbackById(id: string): Promise<IFeedback | null> {
    try {
      const res = await apiClient.get(`/feedbacks/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API getOfficerFeedbackById ${id} failed`, e);
    }
    return null;
  },

  // Cán bộ 1-click tiếp nhận hoặc từ chối phản ánh
  async updateStatus(id: string, status: 'received' | 'rejected'): Promise<IFeedback | null> {
    try {
      const res = await apiClient.patch(`/feedbacks/${id}/status`, { status });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API updateStatus ${id} failed`, e);
    }
    return null;
  },

  // Thống kê số liệu phản ánh
  async getStatistics(filters?: {
    fromDate?: string;
    toDate?: string;
    targetOrganizationId?: string;
    incidentVillageId?: string;
    categoryId?: string;
  }): Promise<IFeedbackStatistics | null> {
    try {
      const res = await apiClient.get('/feedbacks/statistics', { params: filters });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getStatistics failed', e);
    }
    return null;
  },
};
