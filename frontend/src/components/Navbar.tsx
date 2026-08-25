import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGO } from '../assets/images';
import { LayoutDashboard, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="nav">
        <Link to="/" className="brand">
          <img src={BRAND_LOGO} alt="SCT Connect" className="brand-logo" />
        </Link>

        <nav className="links">
          <a href="#gioi-thieu">Giới thiệu</a>
          <a href="#giai-phap">Giải pháp</a>
          <a href="#tinh-nang">Tính năng</a>
          <a href="#loi-ich">Lợi ích</a>
          <a href="#quy-trinh">Cách dùng</a>
          <a href="#doi-tuong">Đối tượng</a>
        </nav>

        <div className="nav-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/portal/dashboard" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LayoutDashboard size={16} />
            <span>Vào Cổng Dân Vận</span>
          </Link>

          <Link to="/login" className="cta-ghost" style={{ padding: '9px 16px' }}>
            <LogIn size={15} style={{ marginRight: 4, display: 'inline' }} />
            <span>Đăng nhập</span>
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Mở menu điều hướng"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <Link to="/portal/dashboard" onClick={closeMobileMenu} style={{ fontWeight: 700, color: 'var(--blue)' }}>
              ✦ Vào Cổng Dân Vận Số
            </Link>
            <Link to="/login" onClick={closeMobileMenu}>
              Đăng nhập tài khoản
            </Link>
            <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '4px 0' }} />
            <a href="#gioi-thieu" onClick={closeMobileMenu}>Giới thiệu</a>
            <a href="#giai-phap" onClick={closeMobileMenu}>Giải pháp</a>
            <a href="#tinh-nang" onClick={closeMobileMenu}>Tính năng</a>
            <a href="#loi-ich" onClick={closeMobileMenu}>Lợi ích</a>
            <a href="#quy-trinh" onClick={closeMobileMenu}>Cách dùng</a>
            <a href="#doi-tuong" onClick={closeMobileMenu}>Đối tượng</a>
            <button
              type="button"
              className="cta-btn sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => { closeMobileMenu(); onOpenContact(); }}
            >
              Đăng ký tư vấn
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
