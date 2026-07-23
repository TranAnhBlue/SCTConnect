import { FieldReport, AdminProcedureReport, DistrictReport, ReportStats } from '../../types';
import { mockFieldReports } from '../mockData/fieldReports';
import { mockAdminReports } from '../mockData/adminReports';
import { mockDistrictReports, mockStats } from '../mockData/districtReports';

// Simulates network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const reportService = {
  // ─── Field Reports ──────────────────────────────────────────────────────────
  async getFieldReports(): Promise<FieldReport[]> {
    await delay(300);
    // TODO: replace with apiClient.get('/reports/field')
    return mockFieldReports;
  },

  async createFieldReport(
    data: Omit<FieldReport, 'id' | 'createdAt' | 'timeAgo' | 'likes' | 'comments'>
  ): Promise<FieldReport> {
    await delay(500);
    // TODO: replace with apiClient.post('/reports/field', data)
    const newReport: FieldReport = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      timeAgo: 'Vừa xong',
      likes: 0,
      comments: 0,
    };
    return newReport;
  },

  // ─── Admin Procedure Reports ─────────────────────────────────────────────────
  async getAdminReports(): Promise<AdminProcedureReport[]> {
    await delay(300);
    // TODO: replace with apiClient.get('/reports/admin')
    return mockAdminReports;
  },

  async createAdminReport(
    data: Omit<AdminProcedureReport, 'id' | 'createdAt' | 'timeAgo'>
  ): Promise<AdminProcedureReport> {
    await delay(500);
    // TODO: replace with apiClient.post('/reports/admin', data)
    const newReport: AdminProcedureReport = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      timeAgo: 'Vừa xong',
    };
    return newReport;
  },

  // ─── District / Map Data ─────────────────────────────────────────────────────
  async getDistrictReports(): Promise<DistrictReport[]> {
    await delay(300);
    // TODO: replace with apiClient.get('/reports/districts')
    return mockDistrictReports;
  },

  async getReportStats(): Promise<ReportStats> {
    await delay(200);
    // TODO: replace with apiClient.get('/reports/stats')
    return mockStats;
  },
};
