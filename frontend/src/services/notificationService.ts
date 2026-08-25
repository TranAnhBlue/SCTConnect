import apiClient from './api';
import { INotification } from '../types/api';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationService = {
  async getNotifications(): Promise<INotification[]> {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getNotifications failed, using fallback', e);
    }
    return MOCK_NOTIFICATIONS;
  },

  async markAsRead(id: string): Promise<INotification> {
    try {
      const res = await apiClient.put(`/notifications/${id}/read`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API markAsRead failed for ${id}`, e);
    }
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === id || n._id === id);
    if (notif) {
      notif.isRead = true;
      return { ...notif };
    }
    return MOCK_NOTIFICATIONS[0];
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      await apiClient.put('/notifications/read-all');
      return true;
    } catch (e) {
      console.warn('API markAllAsRead failed', e);
    }
    MOCK_NOTIFICATIONS.forEach(n => (n.isRead = true));
    return true;
  }
};
