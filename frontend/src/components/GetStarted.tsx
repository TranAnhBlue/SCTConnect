import React from 'react';
import { GET_STARTED_STEPS } from '../constants/landingData';

export const GetStarted: React.FC = () => {
  return (
    <section className="getstarted">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Bắt đầu</span>
          <h2>Bắt đầu rất đơn giản</h2>
          <p>Có đội ngũ SCT hỗ trợ tận nơi nếu cần.</p>
        </div>

        <div className="gs-grid">
          {GET_STARTED_STEPS.map((item) => (
            <div className="gscard reveal" key={item.step}>
              <div className="gs-num">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
