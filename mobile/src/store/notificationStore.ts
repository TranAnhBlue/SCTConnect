import { create } from 'zustand';
import { MemberOrganization } from './authStore';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'report_created' | 'report_responded' | 'reception_created' | 'reception_approved' | 'rating_received';
  isRead: boolean;
  createdAt: string;
  reportId?: string;
  targetRole?: string; // 'citizen' | 'officer' | 'all'
  targetOrg?: MemberOrganization; // 'mttq' | 'youth' | 'women' | 'veterans' | 'union' | 'farmers'
  senderName?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getNotificationsForUser: (role?: string, org?: MemberOrganization, isAuthenticated?: boolean) => AppNotification[];
  getUnreadCountForUser: (role?: string, org?: MemberOrganization, isAuthenticated?: boolean) => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,

  addNotification: (notifData) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      createdAt: 'Vừa xong',
      isRead: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  getNotificationsForUser: (role = 'citizen', org?: MemberOrganization, isAuthenticated = false) => {
    if (!isAuthenticated) return [];
    const all = get().notifications;
    if (!role || role === 'citizen') {
      return all.filter((n) => n.targetRole === 'citizen' || n.targetRole === 'all');
    }
    // Officer view: Filter by role or matching organization
    return all.filter(
      (n) =>
        n.targetRole === 'officer' &&
        (!n.targetOrg || n.targetOrg === org || org === 'mttq' || !org)
    );
  },

  getUnreadCountForUser: (role = 'citizen', org?: MemberOrganization, isAuthenticated = false) => {
    if (!isAuthenticated) return 0;
    const list = get().getNotificationsForUser(role, org, isAuthenticated);
    return list.filter((n) => !n.isRead).length;
  },
}));
