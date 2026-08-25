import React from 'react';
import { TRACKING_STEPS } from '../constants/landingData';

interface SpotlightProps {
  onOpenContact: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ onOpenContact }) => {
  return (
    <section className="spotlight">
      <div className="wrap spotlight-grid">
        <div className="reveal">
          <span className="eyebrow">Theo dõi phản ánh</span>
          <h2>Rõ ràng từ khi gửi đến khi có phản hồi</h2>
          <p className="lead">
            Người dân ngày càng quan tâm đến việc ý kiến của mình được xử lý ra sao. Với SCT Connect, chỉ
            cần mở app là thấy ngay toàn bộ hành trình xử lý: ai tiếp nhận, đang ở bước nào, và kết quả cuối cùng.
          </p>
          <ul className="track-list">
            <li>
              <span className="arrow">→</span>
              Hiển thị rõ cán bộ và đơn vị đang phụ trách
            </li>
            <li>
              <span className="arrow">→</span>
              Ghi nhận thời gian tiếp nhận và các mốc xử lý chính
            </li>
            <li>
              <span className="arrow">→</span>
              Thông báo ngay khi có cập nhật hoặc kết quả xử lý
            </li>
          </ul>
          <button
            type="button"
            className="cta-btn"
            onClick={onOpenContact}
          >
            Xem demo theo dõi phản ánh
          </button>
        </div>

        <div className="track-visual reveal">
          {TRACKING_STEPS.map((step) => (
            <div className={`track-step ${step.done ? 'done' : ''}`} key={step.step}>
              <div className="track-dot">{step.done ? '✓' : step.step}</div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
