import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { IFeedback, FeedbackStatus } from '../types/api';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Eye,
  Tag,
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const STATUS_LABELS: Record<FeedbackStatus, { label: string; badge: string }> = {
  pending: { label: 'Chờ tiếp nhận', badge: 'badge-danger' },
  received: { label: 'Đã tiếp nhận', badge: 'badge-success' },
  rejected: { label: 'Từ chối', badge: 'badge-neutral' }
};

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ tiếp nhận' },
  { key: 'received', label: 'Đã tiếp nhận' },
  { key: 'rejected', label: 'Từ chối' }
];

export const FeedbacksListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isCitizen = user.userType === 'citizen' || user.role === 'citizen';

  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadFeedbacks();
  }, [statusFilter, searchQuery, page]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const filters = {
        page,
        limit: 12,
        status: statusFilter !== 'all' ? (statusFilter as FeedbackStatus) : undefined,
        search: searchQuery.trim() || undefined
      };

      const result = isCitizen
        ? await feedbackService.getMyFeedbacks(filters)
        : await feedbackService.getOfficerFeedbacks(filters);

      setFeedbacks(result.items);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    const { label, badge } = STATUS_LABELS[status] || { label: status, badge: 'badge-neutral' };
    const Icon = status === 'received' ? CheckCircle2 : status === 'rejected' ? XCircle : Clock;
    return (
      <span className={`badge ${badge}`}>
        <Icon size={11} style={{ marginRight: 3 }} /> {label}
      </span>
    );
  };

  const handleStatusFilter = (key: string) => {
    setStatusFilter(key);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  return (
    <div className="feedbacks-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>{isCitizen ? 'Phản ánh của tôi' : 'Quản lý Phản ánh Kiến nghị'}</h2>
          <p className="page-sub">
            {isCitizen
              ? `Danh sách các phản ánh bạn đã gửi (${totalItems} phản ánh)`
              : 'Tiếp nhận, phân loại và xử lý ý kiến nhân dân'}
          </p>
        </div>
        <Link to="/he-thong/phan-anh/gui-moi" className="cta-btn">
          <PlusCircle size={16} />
          <span>Gửi phản ánh mới</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="filter-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc mã phản ánh..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); setPage(1); }}>✕</button>
          )}
        </div>

        <div className="filter-controls">
          <div className="status-tabs">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                className={`tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
                onClick={() => handleStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedbacks Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải danh sách phản ánh...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={44} className="text-muted" />
          <h3>Không tìm thấy phản ánh nào</h3>
          <p>{isCitizen ? 'Bạn chưa gửi phản ánh nào.' : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
            <Link to="/he-thong/phan-anh/gui-moi" className="cta-btn">
              <PlusCircle size={14} /> Gửi phản ánh đầu tiên
            </Link>
            {statusFilter !== 'all' && (
              <button type="button" className="cta-ghost" onClick={() => handleStatusFilter('all')}>
                Xem tất cả
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="feedbacks-grid">
            {feedbacks.map(fb => (
              <div key={fb.id} className="feedback-card">
                <div className="fb-card-top">
                  <span className="code-pill">{fb.code}</span>
                  {getStatusBadge(fb.status)}
                </div>

                <h3 className="fb-card-title">
                  <Link to={`/he-thong/phan-anh/${fb.id}`}>{fb.title}</Link>
                </h3>

                <p className="fb-card-desc">
                  {fb.content.length > 130 ? `${fb.content.slice(0, 130)}...` : fb.content}
                </p>

                {fb.attachments && fb.attachments.length > 0 && (
                  <div className="fb-card-media">
                    <img src={fb.attachments[0].fileUrl} alt={fb.title} />
                    {fb.attachments.length > 1 && (
                      <span className="more-photos">+{fb.attachments.length - 1} ảnh</span>
                    )}
                  </div>
                )}

                <div className="fb-card-tags">
                  {fb.category && (
                    <span className="tag-pill bg-paper">
                      <Tag size={11} /> {fb.category.name}
                    </span>
                  )}
                  {fb.targetOrganization && (
                    <span className="tag-pill bg-blue-soft">
                      <Users size={11} /> {fb.targetOrganization.name}
                    </span>
                  )}
                </div>

                <div className="fb-card-footer">
                  <div className="footer-meta">
                    {fb.incidentVillage && (
                      <span><MapPin size={12} /> {fb.incidentVillage.name}</span>
                    )}
                    <span><Calendar size={12} /> {new Date(fb.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <Link to={`/he-thong/phan-anh/${fb.id}`} className="view-btn">
                    <span>Chi tiết</span>
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <button
                type="button"
                className="cta-ghost"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Trước
              </button>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--ink-soft)' }}>
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                className="cta-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
