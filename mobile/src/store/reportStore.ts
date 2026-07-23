import { create } from 'zustand';
import { FieldReport, AdminProcedureReport, ReportStats } from '../types';
import { reportService } from '../api/services/reportService';

interface ReportState {
  fieldReports: FieldReport[];
  adminReports: AdminProcedureReport[];
  stats: ReportStats | null;
  isLoading: boolean;
  error: string | null;

  fetchFieldReports: () => Promise<void>;
  fetchAdminReports: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addFieldReport: (data: Omit<FieldReport, 'id' | 'createdAt' | 'timeAgo' | 'likes' | 'comments'>) => Promise<void>;
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
      const data = await reportService.getFieldReports();
      set({ fieldReports: data });
    } catch (e: any) {
      set({ error: e.message || 'Lỗi tải dữ liệu' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAdminReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await reportService.getAdminReports();
      set({ adminReports: data });
    } catch (e: any) {
      set({ error: e.message || 'Lỗi tải dữ liệu' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const data = await reportService.getReportStats();
      set({ stats: data });
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  addFieldReport: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newReport = await reportService.createFieldReport(data);
      set((state) => ({ fieldReports: [newReport, ...state.fieldReports] }));
    } catch (e: any) {
      set({ error: e.message || 'Không thể tạo phản ánh' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
