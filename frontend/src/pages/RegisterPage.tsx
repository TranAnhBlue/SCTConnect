import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { villageService } from '../services/villageService';
import { IVillage } from '../types/api';
import { BRAND_LOGO } from '../assets/images';
import { useMessage } from '../hooks/useMessage';
import { PasswordInput } from '../components/PasswordInput';
import { ArrowRight, MapPin, User, Phone, Lock } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = useMessage();

  const [villages, setVillages] = useState<IVillage[]>([]);
  const [villagesLoading, setVillagesLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    villageId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    villageService.getVillages().then(data => {
      setVillages(data);
      setVillagesLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.villageId) {
      message.error('Vui lòng chọn Thôn / Tổ dân phố của bạn');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (formData.password.length < 8) {
      message.error('Mật khẩu phải chứa ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    const loadingKey = 'register';
    message.loading({ content: 'Đang tạo tài khoản...', key: loadingKey });
    try {
      await register({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        villageId: formData.villageId,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      message.success({
        content: `Đăng ký thành công! Chào mừng ${formData.fullName} đến với SCT Connect 🎉`,
        key: loadingKey,
        duration: 3
      });
      navigate('/he-thong/tong-quan');
    } catch (err: any) {
      const respData = err?.response?.data;
      let msg = '';
      if (Array.isArray(respData?.message)) {
        msg = respData.message.join(', ');
      } else if (typeof respData?.message === 'string') {
        msg = respData.message;
      } else {
        msg = err?.message || 'Đăng ký thất bại, vui lòng thử lại';
      }
      message.error({ content: msg, key: loadingKey, duration: 6 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <img src={BRAND_LOGO} alt="SCT Connect" />
          </Link>
          <h2>Đăng ký tài khoản công dân</h2>
          <p>Tạo tài khoản để gửi &amp; theo dõi tiến độ giải quyết phản ánh</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Họ tên */}
          <div className="form-group">
            <label htmlFor="reg-name" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <User size={15} style={{ color: 'var(--blue)' }} />
              <span>Họ và tên <span className="req">*</span></span>
            </label>
            <input
              id="reg-name"
              type="text"
              name="fullName"
              required
              minLength={2}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn An"
            />
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="reg-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Phone size={15} style={{ color: 'var(--blue)' }} />
              <span>Số điện thoại <span className="req">*</span></span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              required
              pattern="^(03|05|07|08|09)\d{8}$"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0988123456"
            />
          </div>

          {/* Thôn / Tổ dân phố */}
          <div className="form-group">
            <label htmlFor="reg-village" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={15} style={{ color: 'var(--blue)' }} />
              <span>Thôn / Tổ dân phố cư trú <span className="req">*</span></span>
            </label>
            <select
              id="reg-village"
              name="villageId"
              required
              value={formData.villageId}
              onChange={handleChange}
              disabled={villagesLoading}
            >
              <option value="">{villagesLoading ? 'Đang tải...' : '-- Chọn Thôn / Tổ dân phố --'}</option>
              {villages.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Mật khẩu */}
          <div className="form-group">
            <label htmlFor="reg-pass" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={15} style={{ color: 'var(--blue)' }} />
              <span>Mật khẩu (tối thiểu 8 ký tự) <span className="req">*</span></span>
            </label>
            <PasswordInput
              id="reg-pass"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              autoComplete="new-password"
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="form-group">
            <label htmlFor="reg-confirm-pass" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={15} style={{ color: 'var(--blue)' }} />
              <span>Xác nhận mật khẩu mới <span className="req">*</span></span>
            </label>
            <PasswordInput
              id="reg-confirm-pass"
              name="confirmPassword"
              required
              minLength={8}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu vừa đặt"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="cta-btn full" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập ngay</Link></p>
          <p><Link to="/">← Quay lại trang giới thiệu</Link></p>
        </div>
      </div>
    </div>
  );
};
