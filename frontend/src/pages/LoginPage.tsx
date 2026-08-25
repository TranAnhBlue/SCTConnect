import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_LOGO } from '../assets/images';
import { MOCK_USERS } from '../services/mockData';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('0988123456');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(phone, password);
      navigate('/portal/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = async (userPhone: string) => {
    setPhone(userPhone);
    setLoading(true);
    try {
      await login(userPhone, 'Password@123');
      navigate('/portal/dashboard');
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
          <h2>Đăng nhập SCT Connect</h2>
          <p>Nền tảng số Mặt trận Tổ quốc và Đoàn thể cơ sở kết nối Nhân dân</p>
        </div>

        {/* Quick Demo Accounts Selection */}
        <div className="quick-roles-box">
          <div className="quick-title">
            <ShieldCheck size={16} />
            <span>Chọn nhanh tài khoản mẫu để trải nghiệm:</span>
          </div>
          <div className="quick-role-buttons">
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`quick-btn ${phone === u.phone ? 'active' : ''}`}
                onClick={() => handleQuickSelect(u.phone)}
              >
                <div className="quick-avatar">
                  <img src={u.avatarUrl} alt={u.fullName} />
                </div>
                <div className="quick-text">
                  <strong>{u.titleName || u.fullName}</strong>
                  <small>{u.phone} — {u.fullName}</small>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="divider">
          <span>hoặc đăng nhập bằng số điện thoại</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-phone">Số điện thoại (10 số)</label>
            <input
              id="login-phone"
              type="tel"
              pattern="^(03|05|07|08|09)\d{8}$"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxx"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">Mật khẩu (ít nhất 8 ký tự)</label>
            <input
              id="login-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="cta-btn full" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản? <Link to="/register">Đăng ký tài khoản công dân</Link></p>
          <p><Link to="/">← Quay lại trang giới thiệu</Link></p>
        </div>
      </div>
    </div>
  );
};
