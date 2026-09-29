import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { IFeedback, FeedbackStatus } from '../types/api';
import { useMessage } from '../hooks/useMessage';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Tag,
  Users,
  FileCheck,
  Building,
  Clock,
  XCircle,
  Hourglass,
  Image as ImageIcon,
  Send,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Chờ tiếp nhận',
    badgeClass: 'badge-danger',
    icon: <Hourglass size={14} />
  },
  received: {
    label: 'Đã tiếp nhận',
    badgeClass: 'badge-success',
    icon: <CheckCircle2 size={14} />
  },
  rejected: {
    label: 'Từ chối',
    badgeClass: 'badge-neutral',
    icon: <XCircle size={14} />
  }
};

type ProgressStage = {
  title: string;
  shortTitle: string;
  completed: boolean;
  rejected?: boolean;
  time?: string;
};

const formatProgressDate = (value?: string) => value
  ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
  : undefined;

const FeedbackProgress: React.FC<{ feedback: IFeedback }> = ({ feedback }) => {
  const [isOpen, setIsOpen] = useState(true);
  const submittedStage: ProgressStage = {
    title: feedback.user?.fullName
      ? `${feedback.user.fullName} đã gửi phản ánh`
      : 'Đã gửi phản ánh',
    shortTitle: 'Đã gửi',
    completed: true,
    time: formatProgressDate(feedback.createdAt),
  };
  const decisionStage: ProgressStage = feedback.status === 'rejected'
    ? {
        title: 'Bộ phận tiếp nhận đã từ chối phản ánh',
        shortTitle: 'Từ chối',
        completed: true,
        rejected: true,
        time: formatProgressDate(feedback.statusUpdatedAt || undefined),
      }
    : {
        title: feedback.status === 'received'
          ? 'Bộ phận tiếp nhận đã tiếp nhận phản ánh'
          : 'Phản ánh đang chờ bộ phận tiếp nhận',
        shortTitle: feedback.status === 'received' ? 'Tiếp nhận' : 'Chờ tiếp nhận',
        completed: feedback.status === 'received',
        time: formatProgressDate(feedback.statusUpdatedAt || undefined),
      };
  const responseStage: ProgressStage = {
    title: feedback.responseContent
      ? 'Cơ quan tiếp nhận đã phản hồi'
      : 'Đang chờ phản hồi kết quả',
    shortTitle: 'Phản hồi',
    completed: Boolean(feedback.responseContent),
    time: formatProgressDate(feedback.respondedAt || undefined),
  };
  const stages: ProgressStage[] = [submittedStage, decisionStage, responseStage];
  const currentStageIndex = feedback.responseContent
    ? 2
    : feedback.status === 'pending'
      ? 1
      : 2;
  const timelineStages = [...stages].reverse();

  return (
    <section className="reception-progress-card feedback-detail-progress">
      <div className="reception-progress-top">
        <div>
          <p className={`reception-status ${feedback.status}`}><strong>{feedback.status === 'pending' ? 'Phản ánh đang chờ tiếp nhận' : feedback.status === 'received' ? 'Phản ánh đã được tiếp nhận' : 'Phản ánh chưa được tiếp nhận'}</strong></p>
          <h3>Tiến trình xử lý phản ánh</h3>
        </div>
      </div>
      <div className="reception-stage-bar" aria-label="Tiến trình xử lý phản ánh">
        {stages.map((stage, index) => {
          const state = stage.rejected ? 'rejected' : stage.completed ? 'completed' : index === currentStageIndex ? 'current' : '';
          return <div className="reception-stage" key={stage.title}>
            <div className={`reception-stage-line ${index < currentStageIndex ? 'completed' : ''}`} />
            <span className={`reception-stage-icon ${state}`}>{stage.completed && !stage.rejected ? <Check size={13} strokeWidth={3} /> : index + 1}</span>
            <span className="reception-stage-label">{stage.shortTitle}</span>
          </div>;
        })}
      </div>
      <div className="reception-timeline-panel">
        <button type="button" className="reception-timeline-toggle" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen}>
          <span>Chi tiết tiến trình xử lý</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && <ol className="reception-timeline">
          {timelineStages.map((stage, index) => <li key={stage.title} className={stage.rejected ? 'rejected' : stage.completed ? 'completed' : ''}>
            <span className="reception-timeline-dot" />
            <div>{index === 0 && (stage.completed || stage.rejected) && <span className="reception-latest-badge">● Mới nhất</span>}<p>{stage.title}</p><time>{stage.time || 'Chưa có thời gian'}</time></div>
          </li>)}
        </ol>}
      </div>
    </section>
  );
};

export const FeedbackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { message } = useMessage();
  const isCitizen = user.userType === 'citizen' || user.role === 'citizen';

  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [responseContent, setResponseContent] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {
    if (id) loadFeedback(id);
  }, [id]);

  useEffect(() => {
    setResponseContent(feedback?.responseContent || '');
  }, [feedback?.id, feedback?.responseContent]);

  const loadFeedback = async (feedbackId: string) => {
    setLoading(true);
    try {
      const data = isCitizen
        ? await feedbackService.getMyFeedbackById(feedbackId)
        : await feedbackService.getOfficerFeedbackById(feedbackId);
      setFeedback(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'received' | 'rejected') => {
    if (!feedback) return;
    const label = newStatus === 'received' ? 'tiếp nhận' : 'từ chối';
    if (!confirm(`Xác nhận ${label} phản ánh này?`)) return;

    setActionLoading(true);
    try {
      const updated = await feedbackService.updateStatus(feedback.id, newStatus);
      if (updated) {
        setFeedback(updated);
        message.success(`Đã ${label} phản ánh thành công`);
      }
    } catch (e: any) {
      message.error(e?.response?.data?.message || `Không thể ${label} phản ánh`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRespond = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!feedback || !responseContent.trim()) return;

    setResponseLoading(true);
    try {
      const updated = await feedbackService.respond(feedback.id, responseContent.trim());
      if (updated) {
        setFeedback(updated);
        setResponseContent(updated.responseContent || '');
        message.success('Đã gửi phản hồi đến công dân');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể gửi phản hồi');
    } finally {
      setResponseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Đang tải thông tin chi tiết phản ánh...</p>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="empty-state">
        <AlertCircle size={48} className="text-muted" />
        <h3>Không tìm thấy phản ánh yêu cầu</h3>
        <Link to="/he-thong/phan-anh" className="cta-btn">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[feedback.status as FeedbackStatus] || STATUS_CONFIG.pending;

  return (
    <div className="feedback-detail-page">
      {/* Breadcrumb & Status */}
      <div className="detail-top-nav">
        <Link to="/he-thong/phan-anh" className="back-link">
          <ArrowLeft size={16} />
          <span>{isCitizen ? 'Phản ánh của tôi' : 'Danh sách phản ánh'}</span>
        </Link>
        <div className="detail-top-badges">
          <span className="code-pill">{feedback.code}</span>
          <span className={`badge ${statusInfo.badgeClass}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {statusInfo.icon} {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="detail-layout-grid">
        {/* Left: Main Content */}
        <div className="detail-main-col">
          {/* Header Card */}
          <div className="detail-card">
            <h1 className="detail-title">{feedback.title}</h1>
            <div className="detail-meta-row">
              {feedback.incidentVillage && (
                <span><MapPin size={14} /> {feedback.incidentVillage.name}</span>
              )}
              <span><Calendar size={14} /> {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</span>
              {feedback.category && (
                <span><Tag size={14} /> {feedback.category.name}</span>
              )}
            </div>

            <div className="detail-description">
              <h3>Nội dung phản ánh</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{feedback.content}</p>
            </div>

            {feedback.address && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--paper)', borderRadius: 8 }}>
                <strong><MapPin size={13} /> Địa chỉ cụ thể:</strong> {feedback.address}
              </div>
            )}

            {/* Attachments */}
            {feedback.attachments && feedback.attachments.length > 0 && (
              <div className="detail-photos">
                <h3><ImageIcon size={16} /> Hình ảnh đính kèm ({feedback.attachments.length})</h3>
                <div className="photos-gallery">
                  {feedback.attachments.map((att, idx) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="photo-item"
                    >
                      <img src={att.fileUrl} alt={`Ảnh minh chứng ${idx + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <FeedbackProgress feedback={feedback} />

          {/* Status Banner for Citizen */}
          {isCitizen && (
            <div className={`detail-card citizen-status-banner ${feedback.status === 'received' ? 'response-card' : ''}`}
              style={{ background: feedback.status === 'received' ? 'var(--success-soft)' : feedback.status === 'rejected' ? 'var(--neutral-soft, #f5f5f5)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>
                  {feedback.status === 'received' ? '✅' : feedback.status === 'rejected' ? '❌' : '⏳'}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>
                    {feedback.status === 'received'
                      ? 'Phản ánh đã được tiếp nhận!'
                      : feedback.status === 'rejected'
                      ? 'Phản ánh đã bị từ chối'
                      : 'Đang chờ cơ quan chức năng tiếp nhận'}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                    {feedback.status === 'received'
                      ? 'Cơ quan chức năng đã ghi nhận phản ánh của bạn và sẽ xử lý theo quy trình.'
                      : feedback.status === 'rejected'
                      ? 'Phản ánh này không đủ điều kiện tiếp nhận hoặc không thuộc thẩm quyền xử lý.'
                      : 'Phản ánh của bạn đã được gửi thành công. Vui lòng chờ cơ quan tiếp nhận.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isCitizen && feedback.responseContent && (
            <div className="detail-card feedback-response-card">
              <div className="feedback-response-card-header">
                <Send size={18} />
                <div>
                  <h3>Phản hồi từ cơ quan tiếp nhận</h3>
                  {feedback.respondedAt && <small>{new Date(feedback.respondedAt).toLocaleString('vi-VN')}</small>}
                </div>
              </div>
              <p>{feedback.responseContent}</p>
            </div>
          )}

          {/* Officer Action Panel */}
          {!isCitizen && feedback.status === 'pending' && (
            <div className="detail-card officer-action-card">
              <div className="officer-card-title">
                <FileCheck size={20} className="text-blue" />
                <h3>Hành động tiếp nhận</h3>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: 16 }}>
                Xem xét nội dung phản ánh và chọn tiếp nhận hoặc từ chối:
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="cta-btn"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('received')}
                  style={{ flex: 1 }}
                >
                  <CheckCircle2 size={16} />
                  {actionLoading ? 'Đang xử lý...' : 'Tiếp nhận'}
                </button>
                <button
                  type="button"
                  className="cta-ghost"
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('rejected')}
                  style={{ flex: 1, borderColor: 'var(--danger, #e53e3e)', color: 'var(--danger, #e53e3e)' }}
                >
                  <XCircle size={16} />
                  Từ chối
                </button>
              </div>
            </div>
          )}

          {/* Officer already processed */}
          {!isCitizen && feedback.status !== 'pending' && (
            <div className="detail-card" style={{ background: 'var(--paper)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)' }}>
                {statusInfo.icon}
                <span>Phản ánh này đã được <strong>{statusInfo.label.toLowerCase()}</strong></span>
              </div>
            </div>
          )}

          {!isCitizen && feedback.status !== 'pending' && (
            <form className="detail-card feedback-response-form" onSubmit={handleRespond}>
              <div className="feedback-response-card-header">
                <Send size={18} />
                <div>
                  <h3>{feedback.responseContent ? 'Cập nhật phản hồi' : 'Phản hồi đến công dân'}</h3>
                  <small>Phản hồi sẽ hiển thị trong chi tiết phản ánh của công dân.</small>
                </div>
              </div>
              <textarea
                value={responseContent}
                onChange={(event) => setResponseContent(event.target.value)}
                minLength={5}
                maxLength={5000}
                required
                placeholder="Nhập nội dung phản hồi, hướng dẫn hoặc kết quả xử lý..."
              />
              <div className="feedback-response-actions">
                <span>{responseContent.length}/5000 ký tự</span>
                <button type="submit" className="cta-btn" disabled={responseLoading}>
                  <Send size={15} /> {responseLoading ? 'Đang gửi...' : feedback.responseContent ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Sidebar Info */}
        <div className="detail-sidebar-col">
          {!isCitizen && (
          <>
          {/* Status Timeline */}
          <div className="detail-card officer-status-timeline">
            <h3>Trạng thái phản ánh</h3>
            <div className="history-timeline">
              {/* Step 1: Submitted */}
              <div className="timeline-item">
                <div className="timeline-dot" style={{ background: 'var(--blue)' }} />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>Đã gửi phản ánh</strong>
                    <small>{new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                  {feedback.user && (
                    <span className="changed-by">{feedback.user.fullName}</span>
                  )}
                </div>
              </div>

              {/* Step 2: Status */}
              <div className="timeline-item">
                <div
                  className="timeline-dot"
                  style={{
                    background: feedback.status === 'received'
                      ? 'var(--success)'
                      : feedback.status === 'rejected'
                      ? 'var(--ink-soft)'
                      : 'var(--warning, #d69e2e)'
                  }}
                />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{statusInfo.label}</strong>
                    {feedback.updatedAt && feedback.status !== 'pending' && (
                      <small>{new Date(feedback.updatedAt).toLocaleDateString('vi-VN')}</small>
                    )}
                  </div>
                  {feedback.targetOrganization && (
                    <span className="changed-by">{feedback.targetOrganization.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Metadata Card */}
          <div className="detail-card">
            <h3>Thông tin phản ánh</h3>
            <div className="meta-list">
              {feedback.user && (
                <div className="meta-item">
                  <span className="meta-label">Người gửi:</span>
                  <strong>{feedback.user.fullName}</strong>
                </div>
              )}
              {feedback.targetOrganization && (
                <div className="meta-item">
                  <span className="meta-label">Tổ chức tiếp nhận:</span>
                  <strong>{feedback.targetOrganization.name}</strong>
                </div>
              )}
              {feedback.incidentVillage && (
                <div className="meta-item">
                  <span className="meta-label">Thôn / Tổ dân phố:</span>
                  <span>{feedback.incidentVillage.name}</span>
                </div>
              )}
              {feedback.category && (
                <div className="meta-item">
                  <span className="meta-label">Lĩnh vực:</span>
                  <span>{feedback.category.name}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Ngày gửi:</span>
                <span>{new Date(feedback.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
