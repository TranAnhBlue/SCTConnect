import apiClient from './api';
import { ICitizenReception } from '../types/api';
import { MOCK_RECEPTIONS } from './mockData';

export const receptionService = {
  async getReceptions(): Promise<ICitizenReception[]> {
    try {
      const res = await apiClient.get('/receptions');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getReceptions failed, using fallback', e);
    }
    return MOCK_RECEPTIONS;
  },

  async createReception(payload: Partial<ICitizenReception>): Promise<ICitizenReception> {
    try {
      const res = await apiClient.post('/receptions', payload);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API createReception failed, using local mock', e);
    }
    const newRec: ICitizenReception = {
      id: `rec-${Date.now()}`,
      code: `TD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0${MOCK_RECEPTIONS.length + 1}`,
      citizenName: payload.citizenName || 'Công dân',
      citizenPhone: payload.citizenPhone || '0900000000',
      address: payload.address || 'Xã Thanh Oai',
      receptionDate: payload.receptionDate || new Date().toISOString().slice(0, 10),
      timeSlot: payload.timeSlot || '08:30 - 09:30',
      topic: payload.topic || 'Ý kiến phản ánh',
      content: payload.content || '',
      hostLeaderName: payload.hostLeaderName || 'Đ/c Nguyễn Văn Minh',
      hostLeaderTitle: payload.hostLeaderTitle || 'Chủ tịch Ủy ban MTTQ Xã',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    MOCK_RECEPTIONS.unshift(newRec);
    return newRec;
  },

  async updateStatus(id: string, status: ICitizenReception['status'], note?: string): Promise<ICitizenReception> {
    try {
      const res = await apiClient.put(`/receptions/${id}/status`, { status, note });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API updateReceptionStatus failed for ${id}`, e);
    }
    const rec = MOCK_RECEPTIONS.find(r => r.id === id || r._id === id);
    if (rec) {
      rec.status = status;
      if (note) rec.note = note;
      return { ...rec };
    }
    return MOCK_RECEPTIONS[0];
  }
};
