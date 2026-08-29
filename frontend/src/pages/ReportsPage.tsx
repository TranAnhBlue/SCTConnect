import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService';
import { IFeedbackStatistics } from '../types/api';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  Printer,
  Users,
  Building,
  MapPin
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<IFeedbackStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackService.getStatistics().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Đang tải báo cáo thống kê...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <BarChart3 size={44} className="text-muted" />
        <h3>Không thể tải dữ liệu thống kê</h3>
        <p>Bạn cần quyền Admin hoặc MTTQ để xem báo cáo này.</p>
      </div>
    );
  }

  const receptionRate = stats.totalFeedbacks > 0
    ? Math.round((stats.totalReceived / stats.totalFeedbacks) * 100)
    : 0;

  return (
    <div className="reports-page">
      <div className="page-header-row">
        <div>
          <h2>Báo Cáo Thống Kê &amp; Giám Sát Dân Vận Số</h2>
          <p className="page-sub">Tổng hợp số liệu phục vụ công tác chỉ đạo điều hành của Lãnh đạo MTTQ và UBND</p>
        </div>
        <button type="button" className="cta-ghost" onClick={() => window.print()}>
          <Printer size={16} />
          <span>In báo cáo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Tổng phản ánh tiếp nhận</span>
          <div className="kpi-value">{stats.totalFeedbacks}</div>
          <span className="kpi-sub">Trên toàn địa bàn xã</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Chờ tiếp nhận</span>
          <div className="kpi-value text-warning" style={{ color: 'var(--warning, #d69e2e)' }}>{stats.totalPending}</div>
          <span className="kpi-sub">{stats.totalPending > 0 ? 'Cần xử lý sớm' : 'Không có tồn đọng'}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Đã tiếp nhận</span>
          <div className="kpi-value text-success">{stats.totalReceived}</div>
          <span className="kpi-sub">Tỷ lệ: {receptionRate}%</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Từ chối</span>
          <div className="kpi-value">{stats.totalRejected}</div>
          <span className="kpi-sub">Không thuộc thẩm quyền</span>
        </div>
      </div>

      <div className="reports-grid-2">
        {/* By Organization */}
        <div className="report-table-card">
          <div className="report-table-header">
            <Users size={18} />
            <h3>Phân bổ theo Tổ chức</h3>
          </div>
          {stats.byOrganizations.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tổ chức đoàn thể</th>
                  <th>Số phản ánh</th>
                  <th>Tỷ lệ (%)</th>
                </tr>
              </thead>
              <tbody>
                {stats.byOrganizations.map((org, i) => (
                  <tr key={i}>
                    <td><strong>{org.name}</strong></td>
                    <td>{org.count}</td>
                    <td>{stats.totalFeedbacks > 0 ? Math.round((org.count / stats.totalFeedbacks) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--ink-soft)', padding: '16px 0' }}>Chưa có dữ liệu</p>
          )}
        </div>

        {/* By Category */}
        <div className="report-table-card">
          <div className="report-table-header">
            <Building size={18} />
            <h3>Phân loại theo Lĩnh vực</h3>
          </div>
          {stats.byCategories.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lĩnh vực chuyên đề</th>
                  <th>Số lượng</th>
                  <th>Phân bổ</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCategories.map((cat, i) => (
                  <tr key={i}>
                    <td>{cat.name}</td>
                    <td><strong>{cat.count}</strong></td>
                    <td>
                      <div className="mini-progress">
                        <div
                          className="mini-fill"
                          style={{ width: `${stats.totalFeedbacks > 0 ? (cat.count / stats.totalFeedbacks) * 100 : 0}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--ink-soft)', padding: '16px 0' }}>Chưa có dữ liệu</p>
          )}
        </div>

        {/* By Village */}
        {stats.byVillages.length > 0 && (
          <div className="report-table-card">
            <div className="report-table-header">
              <MapPin size={18} />
              <h3>Phân bổ theo Thôn / Tổ dân phố</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Thôn / Tổ dân phố</th>
                  <th>Số phản ánh</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {stats.byVillages.map((v, i) => (
                  <tr key={i}>
                    <td>{v.name}</td>
                    <td><strong>{v.count}</strong></td>
                    <td>{stats.totalFeedbacks > 0 ? Math.round((v.count / stats.totalFeedbacks) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
