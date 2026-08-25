import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { IFeedback, FeedbackStatus } from '../types/api';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Clock,
  Eye,
  Calendar,
  AlertCircle,
  Tag,
  Users
} from 'lucide-react';

export const FeedbacksListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [orgFilter, setOrgFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, [statusFilter, categoryFilter, orgFilter, searchQuery]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getFeedbacks({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        targetOrganization: orgFilter !== 'all' ? orgFilter : undefined,
        search: searchQuery.trim() || undefined
      });
      setFeedbacks(data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'done':
        return <span className="badge badge-success">✓ Đã xử lý</span>;
      case 'processing':
        return <span className="badge badge-warning">⚡ Đang xử lý</span>;
      case 'pending':
        return <span className="badge badge-danger">⏳ Chờ tiếp nhận</span>;
      case 'rejected':
        return <span className="badge badge-neutral">✕ Từ chối</span>;
    }
  };

  const getCategoryName = (cat: string) => {
    const map: Record<string, string> = {
      welfare: 'An sinh xã hội',
      environment: 'Môi trường',
      traffic: 'Giao thông',
      supervision: 'Giám sát cộng đồng',
      women_field: 'Hội Phụ nữ',
      youth_field: 'Đoàn Thanh niên',
      veterans_field: 'Hội Cựu chiến binh',
      farmer_field: 'Hội Nông dân',
      security: 'An ninh trật tự'
    };
    return map[cat] || cat;
  };

  const getOrgName = (org?: string) => {
    const map: Record<string, string> = {
      mttq: 'Ủy ban MTTQ',
      youth: 'Đoàn Thanh niên',
      women: 'Hội Phụ nữ',
      veterans: 'Hội Cựu chiến binh',
      farmers: 'Hội Nông dân',
      union: 'Công đoàn'
    };
    return org ? map[org] || org : 'Ủy ban MTTQ';
  };

  return (
    <div className="feedbacks-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>Quản lý Phản ánh Kiến nghị</h2>
          <p className="page-sub">Tiếp nhận, phân loại, phân công và giám sát kết quả xử lý ý kiến nhân dân</p>
        </div>
        <Link to="/portal/feedbacks/create" className="cta-btn">
          <PlusCircle size={16} />
          <span>Gửi phản ánh mới</span>
        </Link>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="filter-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, địa chỉ hoặc mã phản ánh (ví dụ: PA-20260814-001)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="filter-controls">
          {/* Status Tabs */}
          <div className="status-tabs">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'pending', label: 'Chờ tiếp nhận' },
              { key: 'processing', label: 'Đang xử lý' },
              { key: 'done', label: 'Đã hoàn thành' }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                className={`tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="dropdown-filters">
            <div className="select-group">
              <Tag size={14} />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">Tất cả lĩnh vực</option>
                <option value="welfare">An sinh xã hội</option>
                <option value="environment">Môi trường & Rác thải</option>
                <option value="traffic">Giao thông - Đô thị</option>
                <option value="supervision">Giám sát cộng đồng</option>
                <option value="women_field">Công tác Phụ nữ</option>
                <option value="youth_field">Thanh niên & Khởi nghiệp</option>
                <option value="security">An ninh trật tự</option>
              </select>
            </div>

            <div className="select-group">
              <Users size={14} />
              <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
                <option value="all">Tất cả tổ chức phụ trách</option>
                <option value="mttq">Ủy ban MTTQ Xã</option>
                <option value="youth">Đoàn Thanh niên</option>
                <option value="women">Hội Phụ nữ</option>
                <option value="veterans">Hội Cựu chiến binh</option>
                <option value="farmers">Hội Nông dân</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách phản ánh kiến nghị...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="empty-state">
          <AlertCircle size={44} className="text-muted" />
          <h3>Không tìm thấy phản ánh nào</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <button type="button" className="cta-ghost" onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setOrgFilter('all'); setSearchQuery(''); }}>
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="feedbacks-grid">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <div className="fb-card-top">
                <span className="code-pill">{fb.reportCode}</span>
                {getStatusBadge(fb.status)}
              </div>

              <h3 className="fb-card-title">
                <Link to={`/portal/feedbacks/${fb.id}`}>{fb.title}</Link>
              </h3>

              <p className="fb-card-desc">
                {fb.description.length > 140 ? `${fb.description.slice(0, 140)}...` : fb.description}
              </p>

              {fb.imageUrls && fb.imageUrls.length > 0 && (
                <div className="fb-card-media">
                  <img src={fb.imageUrls[0]} alt={fb.title} />
                  {fb.imageUrls.length > 1 && (
                    <span className="more-photos">+{fb.imageUrls.length - 1} ảnh</span>
                  )}
                </div>
              )}

              <div className="fb-card-tags">
                <span className="tag-pill bg-paper"><Tag size={11} /> {getCategoryName(fb.category)}</span>
                <span className="tag-pill bg-blue-soft"><Users size={11} /> {getOrgName(fb.targetOrganization)}</span>
              </div>

              <div className="fb-card-footer">
                <div className="footer-meta">
                  <span><MapPin size={12} /> {fb.address.split(',')[0]}</span>
                  <span><Calendar size={12} /> {new Date(fb.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <Link to={`/portal/feedbacks/${fb.id}`} className="view-btn">
                  <span>Chi tiết</span>
                  <Eye size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
