import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackService } from '../services/feedbackService';
import { IFeedback, IFeedbackStatistics } from '../types/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  Inbox,
  BarChart3,
  Send
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isCitizen = user.userType === 'citizen' || (user as any).role === 'citizen';

  const [recentFeedbacks, setRecentFeedbacks] = useState<IFeedback[]>([]);
  const [stats, setStats] = useState<IFeedbackStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (isCitizen) {
          const result = await feedbackService.getMyFeedbacks({ page: 1, limit: 4 });
          setRecentFeedbacks(result.items);
        } else {
          const [feedbacksResult, statsResult] = await Promise.all([
            feedbackService.getOfficerFeedbacks({ page: 1, limit: 4 }),
            feedbackService.getStatistics()
          ]);
          setRecentFeedbacks(feedbacksResult.items);
          setStats(statsResult);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <span className="badge badge-success"><CheckCircle2 size={11} /> Đã tiếp nhận</span>;
      case 'pending':
        return <span className="badge badge-danger"><Clock size={11} /> Chờ tiếp nhận</span>;
      case 'rejected':
        return <span className="badge badge-neutral"><XCircle size={11} /> Từ chối</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Xin chào, {user?.fullName || 'Đồng chí'}! 👋</h2>
          <p>
            Bạn đang đăng nhập với tư cách:{' '}
            <strong>
              {user?.userType === 'admin'
                ? 'Quản trị viên Toàn Xã'
                : user?.userType === 'officer'
                ? user.organization?.name || 'Cán bộ cơ sở'
                : 'Công dân'}
            </strong>
            {user.village && <span> · {user.village.name}</span>}
          </p>
        </div>
      </div>

      {/* KPI Cards - only for officer/admin */}
      {!isCitizen && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon bg-blue-soft">
              <FileText size={22} className="text-blue" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Tổng phản ánh</span>
              <div className="kpi-value">{stats?.totalFeedbacks ?? 0}</div>
              <span className="kpi-trend text-muted">Dữ liệu thời gian thực</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon bg-warning-soft">
              <Clock size={22} className="text-warning" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Chờ tiếp nhận</span>
              <div className="kpi-value">{stats?.totalPending ?? 0}</div>
              <span className="kpi-trend text-warning">
                {stats?.totalPending ? 'Cần xử lý sớm' : 'Đã xử lý hết'}
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon bg-success-soft">
              <CheckCircle2 size={22} className="text-success" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Đã tiếp nhận</span>
              <div className="kpi-value">{stats?.totalReceived ?? 0}</div>
              <span className="kpi-trend text-success">
                {stats && stats.totalFeedbacks > 0
                  ? `Tỷ lệ ${Math.round((stats.totalReceived / stats.totalFeedbacks) * 100)}%`
                  : 'Chưa có dữ liệu'}
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon bg-paper">
              <XCircle size={22} className="text-muted" />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Từ chối</span>
              <div className="kpi-value">{stats?.totalRejected ?? 0}</div>
              <span className="kpi-trend text-muted">Không thuộc thẩm quyền</span>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Quick Actions — CHỈ 2 nút, KHÔNG có Cơ cấu tổ chức */}
      {isCitizen && (
        <div className="citizen-quick-actions">
          <Link to="/portal/feedbacks/create" className="citizen-action-card citizen-action-primary">
            <div className="citizen-action-icon">
              <Send size={28} />
            </div>
            <div className="citizen-action-text">
              <strong>Gửi phản ánh mới</strong>
              <span>Kiến nghị, phản ánh đến cơ quan chức năng</span>
            </div>
            <ArrowRight size={18} className="citizen-action-arrow" />
          </Link>
          <Link to="/portal/feedbacks" className="citizen-action-card">
            <div className="citizen-action-icon">
              <FileText size={28} />
            </div>
            <div className="citizen-action-text">
              <strong>Phản ánh của tôi</strong>
              <span>Theo dõi trạng thái tiếp nhận</span>
            </div>
            <ArrowRight size={18} className="citizen-action-arrow" />
          </Link>
        </div>
      )}

      {/* Recent Feedbacks */}
      <div className="card dashboard-card">
        <div className="card-header">
          <h3>
            <FileText size={18} style={{ color: 'var(--blue)' }} />
            <span>{isCitizen ? 'Phản ánh gần đây của tôi' : 'Phản ánh mới nhận'}</span>
          </h3>
          <Link to="/portal/feedbacks" className="view-all-link">
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card-body">
          {loading ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div className="spinner" style={{ marginBottom: 8 }} />
              <p>Đang tải...</p>
            </div>
          ) : recentFeedbacks.length === 0 ? (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <Inbox size={48} style={{ color: 'var(--ink-soft)', opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>
                {isCitizen ? 'Bạn chưa gửi phản ánh nào.' : 'Chưa có phản ánh kiến nghị nào.'}
              </p>
              <Link
                to="/portal/feedbacks/create"
                className="cta-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <PlusCircle size={14} />
                <span>Gửi phản ánh đầu tiên</span>
              </Link>
            </div>
          ) : (
            <div className="recent-feedbacks-list">
              {recentFeedbacks.map(fb => (
                <Link to={`/portal/feedbacks/${fb.id}`} key={fb.id} className="recent-fb-item">
                  <div className="recent-fb-main">
                    <div className="recent-fb-code">{fb.code}</div>
                    <h4 className="recent-fb-title">{fb.title}</h4>
                    <p className="recent-fb-desc">{fb.content.slice(0, 100)}{fb.content.length > 100 ? '...' : ''}</p>
                    <div className="recent-fb-meta">
                      {fb.incidentVillage && <span>{fb.incidentVillage.name}</span>}
                      <span>•</span>
                      <span>{new Date(fb.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="recent-fb-side">
                    {getStatusBadge(fb.status)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics breakdown for admin/officer */}
      {!isCitizen && stats && stats.byOrganizations.length > 0 && (
        <div className="card dashboard-card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 size={16} /> Phân bổ theo tổ chức
            </h3>
            <Link to="/portal/reports" className="view-all-link">
              <span>Xem báo cáo đầy đủ</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.byOrganizations.slice(0, 5).map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{
                    width: `${Math.max(8, (item.count / (stats.totalFeedbacks || 1)) * 120)}px`,
                    height: 8, background: 'var(--blue)', borderRadius: 4
                  }} />
                  <div style={{ minWidth: 32, textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
