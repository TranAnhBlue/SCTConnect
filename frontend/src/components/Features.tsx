import React from 'react';
import { FEATURES_DATA } from '../constants/landingData';

export const Features: React.FC = () => {
  return (
    <section className="features" id="tinh-nang">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Tính năng</span>
          <h2>App có những gì?</h2>
          <p>Đầy đủ tính năng giúp quản lý công tác dân vận chuyên nghiệp và minh bạch.</p>
        </div>

        <div className="feature-grid">
          {FEATURES_DATA.map((item, index) => (
            <div className="fcard reveal" key={index}>
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
