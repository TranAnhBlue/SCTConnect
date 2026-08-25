import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { INotification } from '../types/api';
import {
  Bell,
  CheckCircle2,
  FileText,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="notifications-page">
      <div className="page-header-row">
        <div>
          <h2>Trung Tâm Thông Báo</h2>
          <p className="page-sub">Cập nhật kịp thời tiến độ xử lý hồ sơ phản ánh và các chỉ đạo mới</p>
        </div>
        <button type="button" className="cta-ghost" onClick={handleMarkAllRead}>
          <Check size={16} />
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </div>

      <div className="notifications-container-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={44} className="text-muted" />
            <h3>Bạn không có thông báo mới nào</h3>
          </div>
        ) : (
          <div className="notifications-full-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-card-item ${n.isRead ? 'read' : 'unread'}`}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <div className="notif-item-icon bg-blue-soft">
                  <Bell size={20} className="text-blue" />
                </div>
                <div className="notif-item-body">
                  <div className="notif-item-header">
                    <h4>{n.title}</h4>
                    <span className="notif-time">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p>{n.message}</p>
                  {n.relatedId && (
                    <div className="notif-action-link">
                      <Link to={`/portal/feedbacks/${n.relatedId}`}>
                        Xem chi tiết nội dung liên quan →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
