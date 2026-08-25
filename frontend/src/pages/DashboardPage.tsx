import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackService } from '../services/feedbackService';
import { receptionService } from '../services/receptionService';
import { IFeedback, IFeedbackStats, ICitizenReception } from '../types/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smile,
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<IFeedbackStats | null>(null);
  const [recentFeedbacks, setRecentFeedbacks] = useState<IFeedback[]>([]);
  const [receptions, setReceptions] = useState<ICitizenReception[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsData, feedbacksData, receptionsData] = await Promise.all([
          feedbackService.getStats(),
          feedbackService.getFeedbacks(),
          receptionService.getReceptions()
        ]);
        setStats(statsData);
        setRecentFeedbacks(feedbacksData.slice(0, 4));
        setReceptions(receptionsData.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <span className="badge badge-success">Đã xử lý</span>;
      case 'processing':
        return <span className="badge badge-warning">Đang xử lý</span>;
      case 'pending':
        return <span className="badge badge-danger">Chờ tiếp nhận</span>;
      default:
        return <span className="badge badge-neutral">Đã đóng</span>;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Xin chào, {user.fullName}! 👋</h2>
          <p>
            Bạn đang đăng nhập với tư cách: <strong>{user.titleName || user.fullName}</strong> ({user.department || 'Xã Thanh Oai'}).
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/portal/feedbacks/create" className="cta-btn">
            <PlusCircle size={16} />
            <span>Gửi phản ánh mới</span>
          </Link>
          <Link to="/portal/feedbacks" className="cta-ghost">
            <FileText size={16} />
            <span>Tra cứu hồ sơ</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon bg-blue-soft">
            <FileText size={22} className="text-blue" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tổng phản ánh</span>
            <div className="kpi-value">{stats?.total || 156}</div>
            <span className="kpi-trend text-success"><TrendingUp size={12} /> +12% so với tháng trước</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-warning-soft">
            <Clock size={22} className="text-warning" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Đang xử lý</span>
            <div className="kpi-value">{stats?.processing || 42}</div>
            <span className="kpi-sub">Trong hạn xử lý</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-success-soft">
            <CheckCircle2 size={22} className="text-success" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Đã hoàn thành</span>
            <div className="kpi-value">{stats?.done || 92}</div>
            <span className="kpi-trend text-success">Đạt {stats?.resolutionRate || 94.2}% đúng hạn</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon bg-gold-soft">
            <Smile size={22} className="text-gold" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Mức độ hài lòng</span>
            <div className="kpi-value">{stats?.satisfactionAvg || 4.8} / 5.0 ⭐</div>
            <span className="kpi-sub">Từ 112 lượt đánh giá</span>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="shortcuts-bar">
        <Link to="/portal/feedbacks" className="shortcut-item">
          <FileText size={18} />
          <span>Danh sách phản ánh</span>
        </Link>
        <Link to="/portal/map" className="shortcut-item">
          <MapPin size={18} />
          <span>Bản đồ số phản ánh</span>
        </Link>
        <Link to="/portal/community" className="shortcut-item">
          <Users size={18} />
          <span>Bình chọn & Khảo sát</span>
        </Link>
        <Link to="/portal/receptions" className="shortcut-item">
          <Calendar size={18} />
          <span>Đặt lịch tiếp dân</span>
        </Link>
      </div>

      {/* Two Column Layout: Feedbacks vs Charts & Receptions */}
      <div className="dashboard-grid-2">
        {/* Left: Recent Feedbacks */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3>Phản ánh & Kiến nghị mới nhất</h3>
              <p className="card-sub">Cập nhật theo thời gian thực từ ứng dụng và cổng web</p>
            </div>
            <Link to="/portal/feedbacks" className="view-all-link">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          <div className="dash-feedbacks-list">
            {recentFeedbacks.map((fb) => (
              <Link to={`/portal/feedbacks/${fb.id}`} key={fb.id} className="feedback-row-item">
                <div className="fb-row-top">
                  <span className="report-code">{fb.reportCode}</span>
                  {getStatusBadge(fb.status)}
                </div>
                <h4 className="fb-row-title">{fb.title}</h4>
                <div className="fb-row-meta">
                  <span className="address-meta"><MapPin size={12} /> {fb.address}</span>
                  <span className="date-meta">{new Date(fb.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution & Receptions */}
        <div className="dash-column-right">
          {/* Category Breakdown */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3>Phân bổ theo lĩnh vực</h3>
                <p className="card-sub">Tỷ lệ phản ánh theo từng nhóm chuyên đề</p>
              </div>
            </div>

            <div className="category-bars">
              {stats?.byCategory.slice(0, 5).map((cat, idx) => {
                const total = stats.total || 100;
                const percent = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="cat-bar-item">
                    <div className="cat-bar-header">
                      <span>{cat.name}</span>
                      <strong>{cat.count} việc ({percent}%)</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Receptions */}
          <div className="dash-card">
            <div className="dash-card-header">
              <div>
                <h3>Lịch tiếp dân sắp tới</h3>
                <p className="card-sub">Các phiên đối thoại trực tiếp với lãnh đạo</p>
              </div>
              <Link to="/portal/receptions" className="view-all-link">
                Đặt lịch <ArrowRight size={14} />
              </Link>
            </div>

            <div className="receptions-compact-list">
              {receptions.map((rec) => (
                <div key={rec.id} className="rec-compact-item">
                  <div className="rec-date-badge">
                    <Calendar size={14} />
                    <span>{rec.receptionDate}</span>
                  </div>
                  <div className="rec-compact-content">
                    <strong>{rec.citizenName} ({rec.citizenPhone})</strong>
                    <p>{rec.topic}</p>
                    <small>Cán bộ tiếp: {rec.hostLeaderName}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
