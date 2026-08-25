import React from 'react';
import { AUDIENCE_DATA } from '../constants/landingData';

export const Audience: React.FC = () => {
  return (
    <section className="audience" id="doi-tuong">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Đối tượng</span>
          <h2>Ai nên sử dụng?</h2>
          <p>Phù hợp với mọi cấp cơ sở, từ người dân đến cán bộ và các tổ chức thành viên.</p>
        </div>

        <div className="audience-grid">
          {AUDIENCE_DATA.map((item, index) => (
            <div className="acard reveal" key={index}>
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
