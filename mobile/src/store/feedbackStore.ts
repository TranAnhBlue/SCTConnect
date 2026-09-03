import { create } from 'zustand';
import { IFeedback, IFeedbackStatistics, ICreateFeedbackPayload } from '../types/api';
import { feedbackService, IFeedbackFilters } from '../api/feedbackService';

interface FeedbackState {
  feedbacks: IFeedback[];
  stats: IFeedbackStatistics | null;
  isLoading: boolean;
  error: string | null;

  fetchMyFeedbacks: (filters?: IFeedbackFilters) => Promise<void>;
  fetchOfficerFeedbacks: (filters?: IFeedbackFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  createFeedback: (payload: ICreateFeedbackPayload) => Promise<IFeedback>;
  updateFeedbackStatus: (id: string, status: 'received' | 'rejected') => Promise<boolean>;
  clearError: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedbacks: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchMyFeedbacks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const res = await feedbackService.getMyFeedbacks(filters);
      set({ feedbacks: res.items });
    } catch (e: any) {
      set({ error: e.message || 'Lỗi tải danh sách phản ánh' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOfficerFeedbacks: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const res = await feedbackService.getOfficerFeedbacks(filters);
      set({ feedbacks: res.items });
    } catch (e: any) {
      set({ error: e.message || 'Lỗi tải danh sách phản ánh' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await feedbackService.getStatistics();
      set({ stats });
    } catch (e: any) {
      console.warn('Error fetching stats:', e);
    }
  },

  createFeedback: async (payload) => {
    const newFb = await feedbackService.createFeedback(payload);
    set((state) => ({
      feedbacks: [newFb, ...state.feedbacks],
    }));
    return newFb;
  },

  updateFeedbackStatus: async (id, status) => {
    const updated = await feedbackService.updateStatus(id, status);
    if (updated) {
      set((state) => ({
        feedbacks: state.feedbacks.map((fb) => (fb.id === id ? { ...fb, status: updated.status } : fb)),
      }));
      return true;
    }
    return false;
  },

  clearError: () => set({ error: null }),
}));
