import apiClient from './api';
import { IPublicService } from '../types/api';
import { MOCK_SERVICES } from './mockData';

export const publicService = {
  async getServices(): Promise<IPublicService[]> {
    try {
      const res = await apiClient.get('/services');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getServices failed, using fallback', e);
    }
    return MOCK_SERVICES;
  },

  async getAdminProcedureReports(): Promise<{
    totalReceived: number;
    processedOnTime: number;
    processing: number;
    onTimeRate: number;
  }> {
    try {
      const res = await apiClient.get('/services/admin-procedures');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API getAdminProcedureReports failed, using fallback', e);
    }
    return {
      totalReceived: 428,
      processedOnTime: 412,
      processing: 16,
      onTimeRate: 98.4
    };
  }
};
