import React from 'react';
import { FOOTER_LOGO } from '../assets/images';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <img src={FOOTER_LOGO} alt="SCT Connect" />
        </div>
        <div className="foot-links">
          <a href="#tinh-nang">Tính năng</a>
          <a href="#quy-trinh">Quy trình</a>
          <a href="#lien-he">Liên hệ</a>
        </div>
        <p className="copy">
          © 2026 Công ty TNHH Dịch vụ Tư vấn Khoa học và Công nghệ Việt (SCT). Đồng hành chuyển đổi số cùng
          Mặt trận Tổ quốc cơ sở.
        </p>
      </div>
    </footer>
  );
};
