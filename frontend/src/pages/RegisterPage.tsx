import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_LOGO } from '../assets/images';
import { UserRole } from '../types/api';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as UserRole
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu đã nhập');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      });
      navigate('/portal/dashboard');
    } catch {
      setErrorMessage('Đăng ký thất bại, vui lòng kiểm tra lại thông tin');
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

        {errorMessage && (
          <div className="form-note" style={{ color: 'var(--danger)', marginBottom: 14, fontWeight: 600 }}>
            ⚠ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Họ và tên *</label>
            <input
              id="reg-name"
              type="text"
              name="fullName"
              required
              minLength={2}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label htmlFor="reg-phone">Số điện thoại (10 số) *</label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                required
                pattern="^(03|05|07|08|09)\d{8}$"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09xxxxxxxx"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email (tùy chọn)</label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@vidu.vn"
              />
            </div>
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label htmlFor="reg-pass">Mật khẩu (tối thiểu 8 ký tự) *</label>
              <input
                id="reg-pass"
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Ít nhất 8 ký tự"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm-pass">Xác nhận mật khẩu *</label>
              <input
                id="reg-confirm-pass"
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>

          <button type="submit" className="cta-btn full" disabled={loading}>
            {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
          <p><Link to="/">← Quay lại trang giới thiệu</Link></p>
        </div>
      </div>
    </div>
  );
};
