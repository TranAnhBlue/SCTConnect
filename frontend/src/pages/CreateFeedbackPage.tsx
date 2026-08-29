import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { villageService } from '../services/villageService';
import { categoryService } from '../services/categoryService';
import { organizationService } from '../services/organizationService';
import { uploadService } from '../services/uploadService';
import { IVillage, ICategory, IOrganization } from '../types/api';
import { useMessage } from '../hooks/useMessage';
import {
  Upload,
  MapPin,
  Tag,
  Users,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Loader2
} from 'lucide-react';

export const CreateFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [villages, setVillages] = useState<IVillage[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [targetOrganizationId, setTargetOrganizationId] = useState('');
  const [incidentVillageId, setIncidentVillageId] = useState('');

  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdCode, setCreatedCode] = useState('');

  useEffect(() => {
    Promise.all([
      villageService.getVillages(),
      categoryService.getCategories(),
      organizationService.getList()
    ]).then(([v, c, o]) => {
      setVillages(v);
      setCategories(c);
      setOrganizations(o);
      if (c.length > 0) setCategoryId(c[0].id);
      if (o.length > 0) setTargetOrganizationId(o[0].id);
      if (v.length > 0) setIncidentVillageId(v[0].id);
      setDataLoading(false);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('Ảnh tối đa 5MB mỗi file');
      return;
    }
    if (attachments.length >= 5) {
      message.error('Tối đa 5 ảnh mỗi phản ánh');
      return;
    }

    setUploadingFile(true);
    try {
      const uploaded = await uploadService.uploadImage(file);
      setAttachments(prev => [...prev, uploaded.fileUrl]);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Tải ảnh thất bại, vui lòng thử lại');
    } finally {
      setUploadingFile(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !targetOrganizationId || !incidentVillageId) {
      message.error('Vui lòng chọn đầy đủ lĩnh vực, tổ chức và thôn xảy ra sự việc');
      return;
    }

    setSubmitting(true);
    try {
      const created = await feedbackService.createFeedback({
        title: title.trim(),
        content: content.trim(),
        address: address.trim() || undefined,
        categoryId,
        targetOrganizationId,
        incidentVillageId,
        attachments
      });
      setCreatedCode(created.code);
      setSubmitted(true);
    } catch (err: any) {
      const respData = err?.response?.data;
      let msg = '';
      if (Array.isArray(respData?.message)) {
        msg = respData.message.join(', ');
      } else {
        msg = respData?.message || err?.message || 'Gửi phản ánh thất bại';
      }
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="create-feedback-page">
        <div className="form-container-card">
          <div className="success-submit-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: 20 }} />
            <h2 style={{ marginBottom: 8 }}>Gửi phản ánh thành công!</h2>
            <p style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
              Mã phản ánh của bạn: <strong style={{ color: 'var(--blue)', fontSize: '1.1em' }}>{createdCode}</strong>
            </p>
            <p style={{ color: 'var(--ink-soft)', marginBottom: 32 }}>
              Cơ quan chức năng sẽ tiếp nhận và phản hồi sớm nhất. Bạn có thể theo dõi trạng thái trong mục <strong>Phản ánh của tôi</strong>.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/portal/feedbacks" className="cta-btn">
                Xem danh sách phản ánh của tôi
              </Link>
              <button
                type="button"
                className="cta-ghost"
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setContent('');
                  setAddress('');
                  setAttachments([]);
                }}
              >
                Gửi phản ánh khác
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Vui lòng cung cấp đầy đủ thông tin chi tiết và hình ảnh thực tế để cơ quan chức năng phân loại và tiếp nhận nhanh chóng.
          </p>
        </div>

        {dataLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-submit-form">
            {/* Tiêu đề */}
            <div className="form-group">
              <label htmlFor="fb-title">
                Tiêu đề phản ánh <span className="req">*</span>
              </label>
              <input
                id="fb-title"
                type="text"
                required
                minLength={5}
                maxLength={255}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Đề nghị hỗ trợ sửa chữa mái nhà dột nát cho hộ nghèo..."
              />
            </div>

            {/* Lĩnh vực & Tổ chức */}
            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="fb-cat">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={13} />
                    <span>Lĩnh vực phản ánh <span className="req">*</span></span>
                  </span>
                </label>
                <select
                  id="fb-cat"
                  required
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                >
                  <option value="">-- Chọn lĩnh vực --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fb-org">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Users size={13} />
                    <span>Tổ chức tiếp nhận <span className="req">*</span></span>
                  </span>
                </label>
                <select
                  id="fb-org"
                  required
                  value={targetOrganizationId}
                  onChange={e => setTargetOrganizationId(e.target.value)}
                >
                  <option value="">-- Chọn tổ chức --</option>
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Thôn xảy ra & Địa chỉ */}
            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="fb-village">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} />
                    <span>Thôn / Tổ dân phố xảy ra sự việc <span className="req">*</span></span>
                  </span>
                </label>
                <select
                  id="fb-village"
                  required
                  value={incidentVillageId}
                  onChange={e => setIncidentVillageId(e.target.value)}
                >
                  <option value="">-- Chọn thôn --</option>
                  {villages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fb-address">
                  Địa chỉ cụ thể (tùy chọn)
                </label>
                <input
                  id="fb-address"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, thôn xóm..."
                  maxLength={500}
                />
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="form-group">
              <label htmlFor="fb-content">
                Nội dung phản ánh chi tiết <span className="req">*</span>
              </label>
              <textarea
                id="fb-content"
                rows={5}
                required
                minLength={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Mô tả cụ thể diễn biến, thời gian, hiện trạng và mong muốn kiến nghị gửi tới chính quyền và đoàn thể..."
              />
            </div>

            {/* Upload ảnh */}
            <div className="form-group">
              <label>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ImageIcon size={13} />
                  <span>Hình ảnh đính kèm minh chứng (tối đa 5 ảnh, mỗi ảnh ≤5MB)</span>
                </span>
              </label>
              <div className="image-uploader-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  className="cta-ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile || attachments.length >= 5}
                >
                  {uploadingFile ? (
                    <><Loader2 size={14} className="spin" /> Đang tải ảnh...</>
                  ) : (
                    <><Upload size={14} /> Chọn ảnh để tải lên</>
                  )}
                </button>

                {attachments.length > 0 && (
                  <div className="uploaded-thumbnails" style={{ marginTop: 12 }}>
                    {attachments.map((url, idx) => (
                      <div key={idx} className="thumb-item">
                        <img src={url} alt={`Ảnh ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-thumb"
                          onClick={() => handleRemoveAttachment(idx)}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-action-buttons">
              <Link to="/portal/feedbacks" className="cta-ghost">
                Hủy bỏ
              </Link>
              <button type="submit" className="cta-btn" disabled={submitting}>
                {submitting ? 'Đang gửi phản ánh...' : 'Gửi phản ánh'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
