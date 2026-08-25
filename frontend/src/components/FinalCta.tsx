import React from 'react';

interface FinalCtaProps {
  onOpenContact: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenContact }) => {
  return (
    <section className="final-cta" id="lien-he">
      <div className="wrap">
        <div className="cta-panel reveal">
          <div>
            <h2>Đưa Mặt trận Tổ quốc xã bạn lên nền tảng số</h2>
            <p>
              Đội ngũ SCT đồng hành từ khảo sát, thiết kế đến tập huấn sử dụng — sẵn sàng triển khai thí điểm cho địa
              phương của bạn.
            </p>
            <div className="contact-info">
              <span>☎ Hotline: <a href="tel:0000000000">1900 000 000</a></span>
              <span>✉ Email: <a href="mailto:tuvansct@gmail.com">tuvansct@gmail.com</a></span>
            </div>
          </div>

          <div className="cta-buttons">
            <button
              type="button"
              className="cta-btn"
              onClick={onOpenContact}
            >
              Liên hệ đặt lịch demo
            </button>
            <a
              className="cta-ghost"
              href="tel:0000000000"
            >
              Gọi tư vấn triển khai
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
