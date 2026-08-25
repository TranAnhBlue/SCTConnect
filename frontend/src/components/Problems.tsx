import React from 'react';
import { PROBLEMS_DATA } from '../constants/landingData';

interface ProblemsProps {
  onOpenContact: () => void;
}

export const Problems: React.FC<ProblemsProps> = ({ onOpenContact }) => {
  return (
    <section className="problems">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Thực trạng cơ sở</span>
          <h2>Cán bộ và người dân đang gặp những khó khăn gì?</h2>
          <p>Phương thức ghi chép và xử lý truyền thống bộc lộ nhiều điểm nghẽn.</p>
        </div>

        <div className="problem-grid">
          {PROBLEMS_DATA.map((item, index) => (
            <div className="pcard reveal" key={index}>
              <div className="num">{item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="problems-cta reveal">
          <button
            type="button"
            className="cta-btn"
            onClick={onOpenContact}
          >
            Xem cách SCT Connect giải quyết
          </button>
        </div>
      </div>
    </section>
  );
};
