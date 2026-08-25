import React from 'react';
import { STATS_DATA } from '../constants/landingData';

export const Stats: React.FC = () => {
  return (
    <section className="stats">
      <div className="wrap stats-grid">
        {STATS_DATA.map((item, index) => (
          <div className="stat-item reveal" key={index}>
            <div className="num">{item.num}</div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
