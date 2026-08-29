import React, { useState, useEffect, useRef } from 'react';
import { ContactFormData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    org: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = '';
      setIsSuccess(false);
      setHasError(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasError(false);

    const payload = {
      access_key: 'ad0345dd-4440-4f09-88f7-668c5af6e7cb',
      subject: 'Yêu cầu tư vấn mới từ SCT Connect (React Frontend)',
      from_name: 'SCT Connect Landing Page',
      'Họ và tên': formData.name || '',
      'Số điện thoại': formData.phone || '',
      'Email': formData.email || '',
      'Đơn vị / Xã phường': formData.org || '',
      'Nội dung cần tư vấn': formData.message || ''
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.success) {
        setIsSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          org: '',
          message: ''
        });
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng modal"
          onClick={onClose}
        >
          ✕
        </button>

        {!isSuccess ? (
          <div>
            <span className="eyebrow">Đăng ký tư vấn</span>
            <h3 id="modalTitle">Nhận tư vấn triển khai SCT Connect</h3>
            <p className="modal-sub">Để lại thông tin, đội ngũ SCT sẽ liên hệ trong vòng 24h làm việc.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-row">
                  <label htmlFor="cf-name">
                    Họ và tên <span className="req">*</span>
                  </label>
                  <input
                    id="cf-name"
                    ref={nameInputRef}
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="cf-phone">
                    Số điện thoại <span className="req">*</span>
                  </label>
                  <input
                    id="cf-phone"
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9+ ]{8,15}"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xxxxxxxx"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@vidu.vn"
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="cf-org">Đơn vị / Xã, phường</label>
                  <input
                    id="cf-org"
                    type="text"
                    name="org"
                    value={formData.org}
                    onChange={handleChange}
                    placeholder="UBMTTQ xã ..."
                  />
                </div>
                <div className="form-row full">
                  <label htmlFor="cf-message">Nội dung cần tư vấn</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ví dụ: muốn đặt lịch demo cho địa phương..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cta-btn full"
                disabled={loading}
              >
                {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu tư vấn'}
              </button>

              {hasError && (
                <p className="form-note" style={{ color: '#c0392b' }}>
                  Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline bên dưới.
                </p>
              )}

              <p className="form-note">
                Hoặc gọi trực tiếp hotline <a href="tel:0000000000">1900 000 000</a>
              </p>
            </form>
          </div>
        ) : (
          <div id="modalSuccess">
            <div className="success-icon">✓</div>
            <h3>Đã gửi yêu cầu thành công!</h3>
            <p>Cảm ơn bạn đã quan tâm SCT Connect. Đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
            <button
              className="cta-ghost"
              type="button"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
