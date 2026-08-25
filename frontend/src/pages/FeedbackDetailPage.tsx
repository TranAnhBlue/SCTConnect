import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { IFeedback, FeedbackStatus, IUbndResponse } from '../types/api';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Users,
  Send,
  Star,
  FileCheck,
  Building,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';

export const FeedbackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>('processing');
  const [statusNote, setStatusNote] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Official Response state
  const [officialContent, setOfficialContent] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [responseImageUrl, setResponseImageUrl] = useState('');
  const [responseSubmitting, setResponseSubmitting] = useState(false);

  // Citizen Rating state
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadFeedback(id);
    }
  }, [id]);

  const loadFeedback = async (feedbackId: string) => {
    setLoading(true);
    try {
      const data = await feedbackService.getFeedbackById(feedbackId);
      setFeedback(data);
      if (data?.status) setSelectedStatus(data.status);
      if (data?.satisfactionRating) {
        setRating(data.satisfactionRating);
        setRatingComment(data.satisfactionComment || '');
        setRatingSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    setStatusUpdating(true);
    try {
      const updated = await feedbackService.updateStatus(
        feedback.id,
        selectedStatus,
        statusNote,
        user.titleName ? `${user.titleName} - ${user.fullName}` : user.fullName
      );
      setFeedback(updated);
      setStatusNote('');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendOfficialResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    setResponseSubmitting(true);
    try {
      const responseData: IUbndResponse = {
        officerName: user.fullName,
        department: user.department || 'Ủy ban MTTQ Xã',
        officialContent,
        documentNumber,
        responseDate: new Date().toLocaleString('vi-VN'),
        resultImageUrl: responseImageUrl || undefined
      };
      const updated = await feedbackService.updateUbndResponse(feedback.id, responseData);
      setFeedback(updated);
      setOfficialContent('');
      setDocumentNumber('');
    } finally {
      setResponseSubmitting(false);
    }
  };

  const handleRateSatisfaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;
    try {
      const updated = await feedbackService.rateSatisfaction(feedback.id, rating, ratingComment);
      setFeedback(updated);
      setRatingSubmitted(true);
    } catch {}
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Đang tải thông tin chi tiết phản ánh...</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="empty-state">
        <AlertCircle size={48} className="text-muted" />
        <h3>Không tìm thấy phản ánh yêu cầu</h3>
        <Link to="/portal/feedbacks" className="cta-btn">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const isOfficer = user.role !== 'citizen';

  return (
    <div className="feedback-detail-page">
      {/* Top Breadcrumb & Actions */}
      <div className="detail-top-nav">
        <Link to="/portal/feedbacks" className="back-link">
          <ArrowLeft size={16} />
          <span>Danh sách phản ánh</span>
        </Link>
        <div className="detail-top-badges">
          <span className="code-pill">{feedback.reportCode}</span>
          <span className={`badge badge-${feedback.status === 'done' ? 'success' : feedback.status === 'processing' ? 'warning' : 'danger'}`}>
            {feedback.status === 'done' ? 'Đã hoàn thành' : feedback.status === 'processing' ? 'Đang xử lý' : 'Chờ tiếp nhận'}
          </span>
        </div>
      </div>

      <div className="detail-layout-grid">
        {/* Left Column: Main Feedback Content */}
        <div className="detail-main-col">
          {/* Header Card */}
          <div className="detail-card">
            <h1 className="detail-title">{feedback.title}</h1>
            <div className="detail-meta-row">
              <span><MapPin size={14} /> {feedback.address}</span>
              <span><Calendar size={14} /> {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</span>
              <span><Tag size={14} /> {feedback.category}</span>
            </div>

            <div className="detail-description">
              <h3>Nội dung phản ánh</h3>
              <p>{feedback.description}</p>
            </div>

            {feedback.imageUrls && feedback.imageUrls.length > 0 && (
              <div className="detail-photos">
                <h3>Hình ảnh hiện trường ({feedback.imageUrls.length})</h3>
                <div className="photos-gallery">
                  {feedback.imageUrls.map((url, idx) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="photo-item">
                      <img src={url} alt={`Ảnh minh chứng ${idx + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Response from MTTQ / UBND */}
          {feedback.ubndResponse && (
            <div className="detail-card response-card">
              <div className="response-header">
                <div className="response-icon">
                  <Building size={24} />
                </div>
                <div>
                  <h3>Kết quả giải quyết của cơ quan chức năng</h3>
                  <p>
                    {feedback.ubndResponse.department} — Cán bộ: <strong>{feedback.ubndResponse.officerName}</strong>
                  </p>
                  {feedback.ubndResponse.documentNumber && (
                    <span className="doc-num-badge">Số văn bản: {feedback.ubndResponse.documentNumber}</span>
                  )}
                </div>
              </div>

              <div className="response-body">
                <p>{feedback.ubndResponse.officialContent}</p>
                <div className="response-date">
                  <Clock size={13} /> {feedback.ubndResponse.responseDate}
                </div>
              </div>

              {feedback.ubndResponse.resultImageUrl && (
                <div className="response-result-image">
                  <h4>Hình ảnh kết quả sau xử lý:</h4>
                  <img src={feedback.ubndResponse.resultImageUrl} alt="Kết quả xử lý" />
                </div>
              )}
            </div>
          )}

          {/* Citizen Satisfaction Rating */}
          <div className="detail-card rating-card">
            <h3>Đánh giá của người dân sau khi nhận kết quả</h3>
            {!ratingSubmitted ? (
              <form onSubmit={handleRateSatisfaction} className="rating-form">
                <div className="star-select-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`star-btn ${rating >= s ? 'filled' : ''}`}
                      onClick={() => setRating(s)}
                    >
                      <Star size={24} fill={rating >= s ? '#DFA23A' : 'none'} />
                    </button>
                  ))}
                  <span className="rating-label-text">
                    {rating === 5 ? 'Rất hài lòng ⭐⭐⭐⭐⭐' : rating === 4 ? 'Hài lòng ⭐⭐⭐⭐' : `${rating} Sao`}
                  </span>
                </div>

                <div className="form-group" style={{ marginTop: 12 }}>
                  <input
                    type="text"
                    placeholder="Viết nhận xét hoặc lời cảm ơn gửi tới cán bộ xử lý..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="cta-btn">
                  Gửi đánh giá mức độ hài lòng
                </button>
              </form>
            ) : (
              <div className="rating-result-box">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      fill={(feedback.satisfactionRating || 5) >= s ? '#DFA23A' : 'none'}
                      color="#DFA23A"
                    />
                  ))}
                  <strong>{(feedback.satisfactionRating || 5)} / 5 Sao</strong>
                </div>
                {feedback.satisfactionComment && (
                  <p className="rating-quote">"{feedback.satisfactionComment}"</p>
                )}
                <span className="text-success"><CheckCircle2 size={14} /> Cảm ơn bạn đã gửi đánh giá!</span>
              </div>
            )}
          </div>

          {/* Officer Management & Action Panel */}
          {isOfficer && (
            <div className="detail-card officer-action-card">
              <div className="officer-card-title">
                <FileCheck size={20} className="text-blue" />
                <h3>Bảng điều khiển xử lý dành cho cán bộ</h3>
              </div>

              {/* 1. Cập nhật trạng thái */}
              <form onSubmit={handleUpdateStatus} className="status-update-form">
                <h4>1. Cập nhật tiến độ xử lý</h4>
                <div className="form-row-grid">
                  <div className="form-group">
                    <label>Trạng thái mới</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus)}
                    >
                      <option value="pending">Chờ tiếp nhận</option>
                      <option value="processing">Đang xử lý (Chuyển giao / Khảo sát)</option>
                      <option value="done">Đã hoàn thành</option>
                      <option value="rejected">Từ chối (Không thuộc thẩm quyền)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ghi chú tiến độ</label>
                    <input
                      type="text"
                      placeholder="Ghi chú (VD: Đã cử cán bộ xuống hiện trường...)"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="cta-btn" disabled={statusUpdating}>
                  {statusUpdating ? 'Đang lưu...' : 'Lưu cập nhật tiến độ'}
                </button>
              </form>

              <hr className="divider-line" />

              {/* 2. Ban hành văn bản trả lời chính thức */}
              <form onSubmit={handleSendOfficialResponse} className="official-response-form">
                <h4>2. Ban hành văn bản trả lời người dân</h4>
                <div className="form-group">
                  <label>Số hiệu văn bản / Thông báo (nếu có)</label>
                  <input
                    type="text"
                    placeholder="VD: 15/TB-MTTQ-TO"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung trả lời chi tiết *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Nhập nội dung giải trình, phương án xử lý hoặc kết quả giải quyết chính thức..."
                    value={officialContent}
                    onChange={(e) => setOfficialContent(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Link ảnh kết quả nghiệm thu sau xử lý</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={responseImageUrl}
                    onChange={(e) => setResponseImageUrl(e.target.value)}
                  />
                </div>
                <button type="submit" className="cta-btn bg-success" disabled={responseSubmitting}>
                  {responseSubmitting ? 'Đang gửi...' : 'Phê duyệt & Ban hành kết quả'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Timeline & Meta Info */}
        <div className="detail-sidebar-col">
          {/* Progress Timeline */}
          <div className="detail-card">
            <h3>Lịch sử tiến trình</h3>
            <div className="history-timeline">
              {feedback.statusHistory && feedback.statusHistory.map((h, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{h.status === 'done' ? 'Đã hoàn thành' : h.status === 'processing' ? 'Đang xử lý' : 'Chờ tiếp nhận'}</strong>
                      <small>{new Date(h.changedAt).toLocaleDateString('vi-VN')}</small>
                    </div>
                    <span className="changed-by">{h.changedBy}</span>
                    {h.note && <p className="timeline-note">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reporter & Assignment Card */}
          <div className="detail-card">
            <h3>Thông tin phân công & Người gửi</h3>
            <div className="meta-list">
              <div className="meta-item">
                <span className="meta-label">Người gửi:</span>
                <strong>{feedback.isAnonymous ? 'Người dân ẩn danh' : feedback.reporterName || 'Trần Văn An'}</strong>
              </div>
              {!feedback.isAnonymous && feedback.reporterPhone && (
                <div className="meta-item">
                  <span className="meta-label">Số điện thoại:</span>
                  <span>{feedback.reporterPhone}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Tổ chức phụ trách:</span>
                <strong>{feedback.departmentAssigned || 'Ủy ban MTTQ Xã'}</strong>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cán bộ phụ trách:</span>
                <span>{feedback.assignedOfficerName || 'Đ/c Nguyễn Văn Minh'}</span>
              </div>
            </div>

            <div className="chat-shortcut-btn">
              <Link to="/portal/messages" className="cta-ghost full">
                <MessageSquare size={16} />
                <span>Nhắn tin với cán bộ xử lý</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
