import apiClient from './api';
import { IFeedback, IFeedbackStats, IDistrictReport, FeedbackStatus, IUbndResponse } from '../types/api';
import { MOCK_FEEDBACKS, MOCK_STATS, MOCK_DISTRICTS } from './mockData';

export const feedbackService = {
  async getFeedbacks(params?: {
    status?: string;
    category?: string;
    targetOrganization?: string;
    search?: string;
    isOverdue?: boolean;
  }): Promise<IFeedback[]> {
    try {
      const res = await apiClient.get('/feedbacks', { params });
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getFeedbacks failed, using fallback mock', e);
    }
    // Filter local mock
    let list = [...MOCK_FEEDBACKS];
    if (params?.status && params.status !== 'all') {
      list = list.filter(f => f.status === params.status);
    }
    if (params?.category && params.category !== 'all') {
      list = list.filter(f => f.category === params.category);
    }
    if (params?.targetOrganization && params.targetOrganization !== 'all') {
      list = list.filter(f => f.targetOrganization === params.targetOrganization);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(f => f.title.toLowerCase().includes(q) || f.reportCode.toLowerCase().includes(q) || f.address.toLowerCase().includes(q));
    }
    return list;
  },

  async getFeedbackById(id: string): Promise<IFeedback | null> {
    try {
      const res = await apiClient.get(`/feedbacks/${id}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API getFeedbackById ${id} failed, using fallback`, e);
    }
    return MOCK_FEEDBACKS.find(f => f.id === id || f._id === id) || MOCK_FEEDBACKS[0];
  },

  async getFeedbackByCode(code: string): Promise<IFeedback | null> {
    try {
      const res = await apiClient.get(`/feedbacks/code/${code}`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API getFeedbackByCode ${code} failed, using fallback`, e);
    }
    return MOCK_FEEDBACKS.find(f => f.reportCode.toLowerCase() === code.trim().toLowerCase()) || null;
  },

  async createFeedback(payload: Partial<IFeedback>): Promise<IFeedback> {
    try {
      const res = await apiClient.post('/feedbacks', payload);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API createFeedback failed, using fallback mock', e);
    }
    const newFeedback: IFeedback = {
      id: `fb-${Date.now()}`,
      reportCode: `PA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      title: payload.title || 'Phản ánh mới',
      description: payload.description || '',
      address: payload.address || 'Xã Thanh Oai, Hà Nội',
      category: payload.category || 'welfare',
      targetOrganization: payload.targetOrganization || 'mttq',
      departmentAssigned: payload.departmentAssigned || 'Ủy ban MTTQ Xã',
      status: 'pending',
      priority: payload.priority || 'normal',
      statusHistory: [
        {
          status: 'pending',
          changedBy: payload.reporterName || 'Người dân',
          changedAt: new Date().toISOString(),
          note: 'Tiếp nhận phản ánh từ Web Portal'
        }
      ],
      imageUrls: payload.imageUrls || [],
      gps: payload.gps || { lat: 20.872, lng: 105.783 },
      isAnonymous: payload.isAnonymous || false,
      reporterName: payload.reporterName || 'Người dân ẩn danh',
      reporterPhone: payload.reporterPhone || '',
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    MOCK_FEEDBACKS.unshift(newFeedback);
    return newFeedback;
  },

  async updateStatus(id: string, status: FeedbackStatus, note?: string, changedBy = 'Đ/c Nguyễn Văn Minh'): Promise<IFeedback> {
    try {
      const res = await apiClient.put(`/feedbacks/${id}/status`, { status, note, changedBy });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API updateStatus failed for ${id}, updating local mock`, e);
    }
    const fb = MOCK_FEEDBACKS.find(f => f.id === id || f._id === id);
    if (fb) {
      fb.status = status;
      fb.statusHistory.push({
        status,
        changedBy,
        changedAt: new Date().toISOString(),
        note: note || `Cập nhật trạng thái sang ${status}`
      });
      return { ...fb };
    }
    return MOCK_FEEDBACKS[0];
  },

  async updateUbndResponse(id: string, responseData: IUbndResponse): Promise<IFeedback> {
    try {
      const res = await apiClient.put(`/feedbacks/${id}/ubnd-response`, responseData);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API updateUbndResponse failed for ${id}`, e);
    }
    const fb = MOCK_FEEDBACKS.find(f => f.id === id || f._id === id);
    if (fb) {
      fb.ubndResponse = responseData;
      fb.status = 'done';
      fb.statusHistory.push({
        status: 'done',
        changedBy: responseData.officerName,
        changedAt: new Date().toISOString(),
        note: 'Đã hoàn thành xử lý và ban hành văn bản phản hồi'
      });
      return { ...fb };
    }
    return MOCK_FEEDBACKS[0];
  },

  async rateSatisfaction(id: string, rating: number, comment?: string): Promise<IFeedback> {
    try {
      const res = await apiClient.post(`/feedbacks/${id}/rate`, { rating, comment });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API rateSatisfaction failed for ${id}`, e);
    }
    const fb = MOCK_FEEDBACKS.find(f => f.id === id || f._id === id);
    if (fb) {
      fb.satisfactionRating = rating;
      fb.satisfactionComment = comment;
      return { ...fb };
    }
    return MOCK_FEEDBACKS[0];
  },

  async getStats(): Promise<IFeedbackStats> {
    try {
      const res = await apiClient.get('/feedbacks/stats');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getStats failed, using fallback', e);
    }
    return MOCK_STATS;
  },

  async getDistrictMap(): Promise<IDistrictReport[]> {
    try {
      const res = await apiClient.get('/feedbacks/map-districts');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getDistrictMap failed, using fallback', e);
    }
    return MOCK_DISTRICTS;
  }
};
