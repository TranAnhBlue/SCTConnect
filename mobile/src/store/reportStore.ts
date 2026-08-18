import { create } from 'zustand';
import { FieldReport, AdminProcedureReport, ReportStats, UbndFeedbackResponse } from '../types';
import { reportService } from '../api/services/reportService';

interface ReportState {
  fieldReports: FieldReport[];
  adminReports: AdminProcedureReport[];
  stats: ReportStats | null;
  isLoading: boolean;
  error: string | null;

  fetchFieldReports: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchAdminReports: () => Promise<void>;
  createReport: (title: string, description: string, address: string, category: any, departmentAssigned?: string, imageUrl?: string, targetOrganization?: string, reporterName?: string, reporterPhone?: string) => Promise<FieldReport>;
  respondToReport: (id: string, response: UbndFeedbackResponse) => Promise<void>;
  rateReport: (id: string, rating: number) => Promise<void>;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set, get) => ({
  fieldReports: [],
  adminReports: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchFieldReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const reports = await reportService.getFieldReports();
      set({ fieldReports: reports });
    } catch (e: any) {
      set({ error: e.message || 'Lỗi tải danh sách phản ánh' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await reportService.getReportStats();
      set({ stats });
    } catch (e: any) {
      console.warn('Error fetching stats:', e);
    }
  },

  fetchAdminReports: async () => {
    try {
      const adminReports = await reportService.getAdminReports();
      set({ adminReports });
    } catch (e: any) {
      console.warn('Error fetching admin reports:', e);
    }
  },

  createReport: async (title, description, address, category, departmentAssigned, imageUrl, targetOrganization, reporterName, reporterPhone) => {
    const data = {
      title,
      description,
      address,
      category: category || 'supervision',
      departmentAssigned: departmentAssigned || 'Ban Thường trực Ủy ban MTTQ Xã',
      targetOrganization: targetOrganization || 'mttq',
      imageUrl: imageUrl || 'https://picsum.photos/seed/new_report/400/250',
      reporterName: reporterName || 'Trần Anh',
      reporterPhone: reporterPhone || '0912345678',
    };

    // Save to Cloud Database via API
    const newReport = await reportService.createFieldReport(data);
    (newReport as any).targetOrganization = data.targetOrganization;
    (newReport as any).reporterName = data.reporterName;
    (newReport as any).reporterPhone = data.reporterPhone;

    set((state) => ({
      fieldReports: [newReport, ...state.fieldReports],
    }));

    return newReport;
  },

  respondToReport: async (id, response) => {
    // 1. Optimistic update
    set((state) => ({
      fieldReports: state.fieldReports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'done',
              ubndResponse: response,
            }
          : r
      ),
    }));

    // 2. Persist dispatch to Cloud MongoDB
    await reportService.respondToFieldReport(id, response);
  },

  rateReport: async (id, rating) => {
    // 1. Optimistic update
    set((state) => ({
      fieldReports: state.fieldReports.map((r) =>
        r.id === id ? { ...r, satisfactionRating: rating } : r
      ),
    }));

    // 2. Persist 5-star rating to Cloud MongoDB
    await reportService.rateFieldReport(id, rating);
  },

  clearError: () => set({ error: null }),
}));

