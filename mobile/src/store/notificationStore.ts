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

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getNotificationsForUser: (role?: string, org?: MemberOrganization, isAuthenticated?: boolean) => AppNotification[];
  getUnreadCountForUser: (role?: string, org?: MemberOrganization, isAuthenticated?: boolean) => number;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // For Officers (MTTQ & Member Orgs)
  {
    id: 'notif_1',
    title: '📩 Phản ánh mới từ Công dân',
    message: 'Công dân Trần Anh vừa gửi kiến nghị "Cần dọn dẹp điểm tồn đọng rác thải tại Thôn 2" tới Đoàn Thanh niên Xã.',
    type: 'report_created',
    isRead: false,
    createdAt: '15 phút trước',
    reportId: 'rep_1',
    targetRole: 'officer',
    targetOrg: 'youth',
    senderName: 'Trần Anh',
  },
  {
    id: 'notif_2',
    title: '⭐ Đánh giá Mức độ Hài lòng',
    message: 'Công dân Nguyễn Văn Hùng vừa đánh giá 5/5 sao ⭐ cho kết quả xử lý phản ánh Quỹ Vì người nghèo.',
    type: 'rating_received',
    isRead: false,
    createdAt: '1 giờ trước',
    reportId: 'rep_2',
    targetRole: 'officer',
    targetOrg: 'mttq',
    senderName: 'Nguyễn Văn Hùng',
  },
  {
    id: 'notif_3',
    title: '📅 Phiếu Đăng ký Tiếp Công dân mới',
    message: 'Công dân Lê Thị Hoa vừa đăng ký lịch gặp trực tiếp Chủ tịch Ủy ban MTTQ Xã vào ngày 28/07/2026.',
    type: 'reception_created',
    isRead: false,
    createdAt: '3 giờ trước',
    targetRole: 'officer',
    targetOrg: 'mttq',
    senderName: 'Lê Thị Hoa',
  },

  // For Citizens
  {
    id: 'notif_4',
    title: '🏛️ Ban hành Văn bản Trả lời Phản ánh',
    message: 'Đồng chí Nguyễn Văn Minh (Ủy ban MTTQ Xã) đã ban hành Thông báo Số 108/TB-MTTQ trả lời kiến nghị của bạn.',
    type: 'report_responded',
    isRead: false,
    createdAt: '30 phút trước',
    reportId: 'rep_1',
    targetRole: 'citizen',
    senderName: 'Nguyễn Văn Minh',
  },
  {
    id: 'notif_5',
    title: '✅ Xác nhận Lịch Hẹn Tiếp Công dân',
    message: 'Thường trực Mặt trận Xã đã duyệt lịch hẹn gặp Lãnh đạo của bạn vào lúc 08:30 ngày 28/07/2026.',
    type: 'reception_approved',
    isRead: true,
    createdAt: '1 ngày trước',
    targetRole: 'citizen',
    senderName: 'Thường trực MTTQ Xã',
  },
];

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
