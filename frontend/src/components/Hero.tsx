import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGO } from '../assets/images';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  return (
    <section className="hero" id="gioi-thieu">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Giải pháp chuyển đổi số cho Mặt trận Tổ quốc cấp xã</span>
          <h1>
            Mỗi phản ánh của dân, đều có nơi đến và <em>có ngày trả lời</em>
          </h1>
          <p className="lead">
            SCT Connect giúp UBMTTQ xã và các tổ chức thành viên tiếp nhận, phân loại, xử lý và phản hồi ý
            kiến người dân trên cùng một nền tảng — không cần đến tận trụ sở, không thất lạc giữa sổ sách.
          </p>

          <ul className="check-list">
            <li>
              <span className="arrow">→</span>
              Gửi phản ánh nhanh chỉ bằng một chiếc điện thoại
            </li>
            <li>
              <span className="arrow">→</span>
              Quản lý toàn bộ quy trình từ tiếp nhận đến phản hồi
            </li>
            <li>
              <span className="arrow">→</span>
              Tạo báo cáo, thống kê tự động theo lĩnh vực và địa bàn
            </li>
          </ul>

          <div className="hero-ctas">
            <Link
              to="/dang-ky"
              className="cta-btn"
            >
              Đăng ký dùng thử miễn phí
            </Link>
            <button
              type="button"
              className="cta-ghost"
              onClick={onOpenContact}
            >
              Nhận tư vấn ngay
            </button>
          </div>
        </div>

        <div className="hero-logo-card reveal">
          <img
            src={BRAND_LOGO}
            alt="SCT Connect Logo"
          />
          <p className="cap">
            <strong>SCT Connect</strong> — Nền tảng kết nối nhân dân với Mặt trận Tổ quốc và các đoàn thể cơ sở.
          </p>
        </div>
      </div>
    </section>
  );
};
