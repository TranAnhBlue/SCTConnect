import React from 'react';
import { PROCESS_STEPS } from '../constants/landingData';

export const Process: React.FC = () => {
  return (
    <section className="process" id="quy-trinh">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Cách dùng</span>
          <h2>Dùng dễ như thế nào?</h2>
          <p>Chỉ 3 bước đơn giản — không cần gõ nhiều, chỉ cần chọn.</p>
        </div>

        <div className="steps">
          {PROCESS_STEPS.map((item, index) => (
            <div className="step reveal" key={index}>
              <div className="step-num">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
