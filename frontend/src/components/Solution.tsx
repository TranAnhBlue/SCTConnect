import React from 'react';

interface SolutionProps {
  onOpenContact: () => void;
}

export const Solution: React.FC<SolutionProps> = ({ onOpenContact }) => {
  return (
    <section className="solution" id="giai-phap">
      <div className="wrap solution-grid">
        <div className="reveal">
          <span className="eyebrow">Giải pháp</span>
          <h2>Giải pháp đơn giản cho cơ sở</h2>
          <p className="lead">
            Không cần đầu tư thiết bị đắt tiền hay máy móc cồng kềnh. SCT Connect được thiết kế tối giản,
            dễ dùng trên điện thoại thông minh cho cả người lớn tuổi lẫn cán bộ bận rộn.
          </p>
          <button
            type="button"
            className="cta-btn"
            onClick={onOpenContact}
          >
            Tìm hiểu thêm về giải pháp
          </button>
        </div>

        <div className="solution-visual reveal">
          <h3>Chỉ cần một chiếc điện thoại là đủ</h3>
          <ul>
            <li>
              <span className="dot"></span>
              <span><strong>Người dân:</strong> Mở ứng dụng, chụp ảnh, gửi ý kiến mọi lúc mọi nơi</span>
            </li>
            <li>
              <span className="dot"></span>
              <span><strong>Cán bộ:</strong> Tiếp nhận, chuyển giao, cập nhật tiến độ chỉ với vài lần chạm</span>
            </li>
            <li>
              <span className="dot"></span>
              <span><strong>Lãnh đạo:</strong> Xem báo cáo tổng hợp, thống kê địa bàn ngay trên màn hình</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
