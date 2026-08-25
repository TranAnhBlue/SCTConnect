import React from 'react';
import { BENEFITS_DATA } from '../constants/landingData';

export const Benefits: React.FC = () => {
  return (
    <section className="benefits" id="loi-ich">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Lợi ích</span>
          <h2>Cán bộ và người dân được gì khi dùng?</h2>
          <p>Vận hành minh bạch hơn, xử lý nhanh hơn, phối hợp hiệu quả hơn.</p>
        </div>

        <div className="benefit-grid">
          {BENEFITS_DATA.map((item, index) => (
            <div className="bcard reveal" key={index}>
              <div className="glyph">{item.glyph}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
