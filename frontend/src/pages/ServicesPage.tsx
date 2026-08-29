import React from 'react';
import { Link } from 'react-router-dom';
export const ServicesPage: React.FC = () => (
  <div className="empty-state" style={{ padding: 60 }}>
    <h3>Tính năng đang phát triển</h3>
    <p style={{ color: 'var(--ink-soft)' }}>Dịch vụ công &amp; Thủ tục hành chính sẽ được bổ sung trong phiên bản tiếp theo.</p>
    <Link to="/portal/dashboard" className="cta-btn" style={{ marginTop: 16, display: 'inline-flex' }}>← Về Bảng tổng quan</Link>
  </div>
);
