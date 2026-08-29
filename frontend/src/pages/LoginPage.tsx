import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_LOGO } from '../assets/images';
import { useMessage } from '../hooks/useMessage';
import { PasswordInput } from '../components/PasswordInput';
import { ArrowRight, KeyRound } from 'lucide-react';

const SAVED_PHONE_KEY = 'sct_saved_phone';
const SAVED_PASSWORD_KEY = 'sct_saved_password';
const REMEMBER_LOGIN_KEY = 'sct_remember_login';

// Hàm mã hóa/giải mã cơ bản an toàn để không lưu plain text thô
const encodeSecret = (str: string) => {
  try { return btoa(encodeURIComponent(str)); } catch { return str; }
};
const decodeSecret = (str: string) => {
  try { return decodeURIComponent(atob(str)); } catch { return ''; }
};

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = useMessage();

  const isRemembered = localStorage.getItem(REMEMBER_LOGIN_KEY) === 'true';
  const savedPhone = localStorage.getItem(SAVED_PHONE_KEY) || '';
  const savedPass = localStorage.getItem(SAVED_PASSWORD_KEY) ? decodeSecret(localStorage.getItem(SAVED_PASSWORD_KEY)!) : '';

  const [phone, setPhone] = useState(savedPhone);
  const [password, setPassword] = useState(savedPass);
  const [rememberLogin, setRememberLogin] = useState(isRemembered);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanPassword = password.trim();

    if (!cleanPhone || !cleanPassword) {
      message.warning('Vui lòng nhập đầy đủ số điện thoại và mật khẩu');
      return;
    }

    // Xử lý Ghi nhớ tài khoản & mật khẩu
    if (rememberLogin) {
      localStorage.setItem(REMEMBER_LOGIN_KEY, 'true');
      localStorage.setItem(SAVED_PHONE_KEY, cleanPhone);
      localStorage.setItem(SAVED_PASSWORD_KEY, encodeSecret(cleanPassword));
    } else {
      localStorage.removeItem(REMEMBER_LOGIN_KEY);
      localStorage.removeItem(SAVED_PHONE_KEY);
      localStorage.removeItem(SAVED_PASSWORD_KEY);
    }

    setLoading(true);
    const loadingKey = 'login';
    message.loading({ content: 'Đang xác thực tài khoản...', key: loadingKey });
    try {
      await login(cleanPhone, cleanPassword);
      message.success({ content: 'Đăng nhập thành công! Đang chuyển hướng...', key: loadingKey, duration: 2 });
      navigate('/he-thong/tong-quan');
    } catch (err: any) {
      const respData = err?.response?.data;
      let msg = '';
      if (Array.isArray(respData?.message)) {
        msg = respData.message.join(', ');
      } else if (typeof respData?.message === 'string') {
        msg = respData.message;
      } else if (respData?.errors && Array.isArray(respData.errors)) {
        msg = respData.errors.map((e: any) => e.message || e).join(', ');
      } else {
        msg = err?.message || 'Số điện thoại hoặc mật khẩu không chính xác';
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
          <h2>Đăng nhập SCT Connect</h2>
          <p>Nền tảng số Mặt trận Tổ quốc và Đoàn thể cơ sở kết nối Nhân dân</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="on">
          <div className="form-group">
            <label htmlFor="login-phone">
              Số điện thoại <span className="req">*</span>
            </label>
            <input
              id="login-phone"
              type="tel"
              name="username"
              autoComplete="username"
              pattern="^(03|05|07|08|09)\d{8}$"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0988123456"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">
              Mật khẩu <span className="req">*</span>
            </label>
            <PasswordInput
              id="login-pass"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {/* Checkbox Ghi nhớ tài khoản & mật khẩu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '8px 0 16px 0' }}>
            <input
              id="remember-login"
              type="checkbox"
              checked={rememberLogin}
              onChange={e => setRememberLogin(e.target.checked)}
              style={{
                width: 17,
                height: 17,
                cursor: 'pointer',
                accentColor: 'var(--blue)',
                borderRadius: 4
              }}
            />
            <label
              htmlFor="remember-login"
              style={{
                fontSize: '0.9rem',
                color: 'var(--ink)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 500
              }}
            >
              <KeyRound size={14} style={{ color: 'var(--blue)' }} />
              <span>Ghi nhớ tài khoản và mật khẩu</span>
            </label>
          </div>

          <button type="submit" className="cta-btn full" disabled={loading}>
            {loading ? 'Đang xác thực tài khoản...' : 'Đăng nhập vào hệ thống'}
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Chưa có tài khoản? <Link to="/dang-ky">Đăng ký tài khoản công dân</Link></p>
          <p><Link to="/">← Quay lại trang giới thiệu</Link></p>
        </div>
      </div>
    </div>
  );
};
