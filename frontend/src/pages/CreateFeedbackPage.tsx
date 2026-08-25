import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { FeedbackCategory, OrganizationType, FeedbackPriority } from '../types/api';
import {
  Upload,
  MapPin,
  Tag,
  Users,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export const CreateFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Thôn 2, Xã Thanh Oai, Huyện Thanh Oai, Hà Nội');
  const [category, setCategory] = useState<FeedbackCategory>('welfare');
  const [targetOrganization, setTargetOrganization] = useState<OrganizationType>('mttq');
  const [priority, setPriority] = useState<FeedbackPriority>('normal');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(user.fullName || '');
  const [reporterPhone, setReporterPhone] = useState(user.phone || '');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&h=400&fit=crop'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await feedbackService.createFeedback({
        title,
        description,
        address,
        category,
        targetOrganization,
        priority,
        isAnonymous,
        reporterName: isAnonymous ? 'Người dân ẩn danh' : reporterName,
        reporterPhone: isAnonymous ? '' : reporterPhone,
        imageUrls
      });
      navigate(`/portal/feedbacks/${created.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-feedback-page">
      <div className="page-nav-back">
        <Link to="/portal/feedbacks" className="back-link">
          <ArrowLeft size={16} />
          <span>Quay lại danh sách phản ánh</span>
        </Link>
      </div>

      <div className="form-container-card">
        <div className="form-card-header">
          <span className="eyebrow">Tiếp nhận ý kiến nhân dân</span>
          <h2>Gửi Phản Ánh &amp; Kiến Nghị Mới</h2>
          <p>
            Vui lòng cung cấp đầy đủ thông tin chi tiết và hình ảnh thực tế để cơ quan chức năng phân loại và xử lý nhanh chóng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-submit-form">
          {/* Tiêu đề */}
          <div className="form-group">
            <label htmlFor="fb-title">Tiêu đề phản ánh *</label>
            <input
              id="fb-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Đề nghị hỗ trợ sửa chữa mái nhà dột nát cho hộ nghèo..."
            />
          </div>

          {/* Phân loại & Tổ chức phụ trách */}
          <div className="form-row-grid">
            <div className="form-group">
              <label htmlFor="fb-cat">Lĩnh vực chuyên đề *</label>
              <select
                id="fb-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
              >
                <option value="welfare">An sinh xã hội & Vì người nghèo</option>
                <option value="environment">Môi trường & Rác thải</option>
                <option value="traffic">Giao thông - Đô thị</option>
                <option value="supervision">Giám sát đầu tư cộng đồng</option>
                <option value="women_field">Công tác Phụ nữ & Trẻ em</option>
                <option value="youth_field">Thanh niên & Khởi nghiệp</option>
                <option value="veterans_field">Công tác Cựu chiến binh</option>
                <option value="farmer_field">Nông nghiệp & Nông dân</option>
                <option value="security">An ninh trật tự cơ sở</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fb-org">Tổ chức phụ trách tiếp nhận</label>
              <select
                id="fb-org"
                value={targetOrganization}
                onChange={(e) => setTargetOrganization(e.target.value as OrganizationType)}
              >
                <option value="mttq">Ủy ban MTTQ Xã</option>
                <option value="youth">Đoàn TNCS Hồ Chí Minh</option>
                <option value="women">Hội Liên hiệp Phụ nữ</option>
                <option value="veterans">Hội Cựu chiến binh</option>
                <option value="farmers">Hội Nông dân</option>
                <option value="union">Công đoàn cơ sở</option>
              </select>
            </div>
          </div>

          {/* Mức độ ưu tiên & Địa chỉ */}
          <div className="form-row-grid">
            <div className="form-group">
              <label htmlFor="fb-prio">Mức độ ưu tiên</label>
              <select
                id="fb-prio"
                value={priority}
                onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
              >
                <option value="normal">Bình thường (xử lý theo quy định)</option>
                <option value="urgent">Khẩn cấp (nguy cơ sập, cháy nổ, ô nhiễm nặng)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fb-address">Địa điểm / Vị trí xảy ra sự việc *</label>
              <input
                id="fb-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, thôn xóm, xã phường..."
              />
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div className="form-group">
            <label htmlFor="fb-desc">Nội dung phản ánh chi tiết *</label>
            <textarea
              id="fb-desc"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể diễn biến, thời gian, hiện trạng và mong muốn kiến nghị gửi tới chính quyền và đoàn thể..."
            />
          </div>

          {/* Ảnh đính kèm */}
          <div className="form-group">
            <label>Hình ảnh đính kèm minh chứng</label>
            <div className="image-uploader-box">
              <div className="image-url-input-row">
                <input
                  type="url"
                  placeholder="Dán link ảnh hoặc tải ảnh lên..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <button type="button" className="cta-ghost" onClick={handleAddImage}>
                  Thêm ảnh
                </button>
              </div>

              <div className="uploaded-thumbnails">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="thumb-item">
                    <img src={url} alt={`Ảnh ${idx + 1}`} />
                    <button type="button" className="remove-thumb" onClick={() => handleRemoveImage(idx)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông tin người gửi */}
          <div className="sender-info-box">
            <div className="anon-checkbox">
              <input
                id="is-anon"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="is-anon">Gửi ẩn danh (Thông tin cá nhân của bạn sẽ không hiển thị công khai)</label>
            </div>

            {!isAnonymous && (
              <div className="form-row-grid" style={{ marginTop: 12 }}>
                <div className="form-group">
                  <label htmlFor="rep-name">Họ tên người gửi</label>
                  <input
                    id="rep-name"
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rep-phone">Số điện thoại liên hệ</label>
                  <input
                    id="rep-phone"
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="Số điện thoại"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-action-buttons">
            <Link to="/portal/feedbacks" className="cta-ghost">
              Hủy bỏ
            </Link>
            <button type="submit" className="cta-btn" disabled={loading}>
              {loading ? 'Đang gửi phản ánh...' : 'Gửi phản ánh tới Mặt trận Tổ quốc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
