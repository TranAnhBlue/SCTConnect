import apiClient from './api';
import { IFeedback, IPaginatedFeedbacks, FeedbackStatus, IFeedbackStatistics } from '../types/api';

export interface IFeedbackFilters {
  page?: number;
  limit?: number;
  search?: string;
  targetOrganizationId?: string;
  incidentVillageId?: string;
  categoryId?: string;
  status?: FeedbackStatus;
  fromDate?: string;
  toDate?: string;
}

export interface ICreateFeedbackPayload {
  targetOrganizationId: string;
  incidentVillageId: string;
  categoryId: string;
  address?: string;
  title: string;
  content: string;
  attachments?: string[];
}

export const feedbackService = {
  // Công dân gửi phản ánh
  async createFeedback(payload: ICreateFeedbackPayload): Promise<IFeedback> {
    const res = await apiClient.post('/feedbacks', payload);
    return res.data?.data || res.data;
  },

  // Công dân xem danh sách phản ánh của chính mình
  async getMyFeedbacks(filters?: IFeedbackFilters): Promise<IPaginatedFeedbacks> {
    try {
      const res = await apiClient.get('/feedbacks/me', { params: filters });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getMyFeedbacks failed', e);
    }
    return { items: [], pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0 } };
  },

  // Công dân xem chi tiết 1 phản ánh của chính mình
  async getMyFeedbackById(id: string): Promise<IFeedback | null> {
    try {
      const res = await apiClient.get(`/feedbacks/me/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API getMyFeedbackById ${id} failed`, e);
    }
    return null;
  },

  // Cán bộ/Admin xem danh sách phản ánh
  async getOfficerFeedbacks(filters?: IFeedbackFilters): Promise<IPaginatedFeedbacks> {
    try {
      const res = await apiClient.get('/feedbacks', { params: filters });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getOfficerFeedbacks failed', e);
    }
    return { items: [], pagination: { currentPage: 1, pageSize: 20, totalItems: 0, totalPages: 0 } };
  },

  // Cán bộ xem chi tiết phản ánh theo ID
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

  // Báo cáo thống kê (Admin/MTTQ)
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
  }
};
