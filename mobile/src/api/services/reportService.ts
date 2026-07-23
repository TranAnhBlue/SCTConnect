import { FieldReport, AdminProcedureReport, DistrictReport, ReportStats, UbndFeedbackResponse } from '../../types';
import { apiClient } from '../axios';
import { mockFieldReports } from '../mockData/fieldReports';
import { mockAdminReports } from '../mockData/adminReports';
import { mockDistrictReports, mockStats } from '../mockData/districtReports';

export const reportService = {
  // ─── Field Reports (MongoDB Atlas Cloud Integration) ────────────────────────
  async getFieldReports(): Promise<FieldReport[]> {
    try {
      const res = await apiClient.get('/feedbacks');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data.map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description,
          address: item.address,
          category: item.category || 'environment',
          status: item.status || 'pending',
          departmentAssigned: item.departmentAssigned,
          imageUrl: item.imageUrl,
          likes: item.likes || 0,
          comments: item.comments || 0,
          ubndResponse: item.ubndResponse,
          satisfactionRating: item.satisfactionRating,
          createdAt: item.createdAt || new Date().toISOString(),
          timeAgo: item.createdAt ? 'Vừa xong' : 'Hôm nay',
        }));
      }
      return mockFieldReports;
    } catch (err) {
      console.warn('API Offline - Using mock data fallback:', err);
      return mockFieldReports;
    }
  },

  async createFieldReport(
    data: { title: string; description: string; address: string; category: any; departmentAssigned?: string; imageUrl?: string }
  ): Promise<FieldReport> {
    try {
      const res = await apiClient.post('/feedbacks', data);
      const item = res.data?.data;
      return {
        id: item?._id || Date.now().toString(),
        title: item?.title || data.title,
        description: item?.description || data.description,
        address: item?.address || data.address,
        category: item?.category || data.category,
        status: item?.status || 'pending',
        departmentAssigned: item?.departmentAssigned || data.departmentAssigned,
        imageUrl: item?.imageUrl || data.imageUrl,
        createdAt: item?.createdAt || new Date().toISOString(),
        timeAgo: 'Vừa xong',
        likes: 0,
        comments: 0,
      };
    } catch (err) {
      console.warn('API Error creating feedback:', err);
      return {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        timeAgo: 'Vừa xong',
        likes: 0,
        comments: 0,
      };
    }
  },

  async respondToFieldReport(id: string, responseData: UbndFeedbackResponse): Promise<void> {
    try {
      await apiClient.put(`/feedbacks/${id}/ubnd-response`, responseData);
    } catch (err) {
      console.warn('API Error updating officer response:', err);
    }
  },

  async rateFieldReport(id: string, rating: number): Promise<void> {
    try {
      await apiClient.post(`/feedbacks/${id}/rate`, { rating });
    } catch (err) {
      console.warn('API Error saving rating:', err);
    }
  },

  // ─── Admin Procedure Reports ─────────────────────────────────────────────────
  async getAdminReports(): Promise<AdminProcedureReport[]> {
    return mockAdminReports;
  },

  async createAdminReport(
    data: Omit<AdminProcedureReport, 'id' | 'createdAt' | 'timeAgo'>
  ): Promise<AdminProcedureReport> {
    return {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      timeAgo: 'Vừa xong',
    };
  },

  // ─── District / Map Data ─────────────────────────────────────────────────────
  async getDistrictReports(): Promise<DistrictReport[]> {
    return mockDistrictReports;
  },

  async getReportStats(): Promise<ReportStats> {
    return mockStats;
  },
};
