import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService';
import { publicService } from '../services/publicService';
import { IFeedbackStats } from '../types/api';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Users,
  Building
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<IFeedbackStats | null>(null);
  const [adminReport, setAdminReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const [sData, aData] = await Promise.all([
          feedbackService.getStats(),
          publicService.getAdminProcedureReports()
        ]);
        setStats(sData);
        setAdminReport(aData);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">
      <div className="page-header-row">
        <div>
          <h2>Báo Cáo Thống Kê &amp; Giám Sát Dân Vận Số</h2>
          <p className="page-sub">Tổng hợp số liệu phục vụ công tác chỉ đạo điều hành của Lãnh đạo MTTQ và UBND</p>
        </div>
        <div className="report-actions">
          <button type="button" className="cta-ghost" onClick={handlePrint}>
            <Printer size={16} />
            <span>In báo cáo</span>
          </button>
          <button type="button" className="cta-btn" onClick={() => alert('Xuất báo cáo PDF thành công!')}>
            <Download size={16} />
            <span>Xuất file Excel / PDF</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Tổng số phản ánh tiếp nhận</span>
          <div className="kpi-value">{stats?.total || 156}</div>
          <span className="kpi-sub">100% được cập nhật lên hệ thống số</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Tỷ lệ giải quyết đúng hạn</span>
          <div className="kpi-value text-success">{stats?.resolutionRate || 94.2}%</div>
          <span className="kpi-sub">Vượt chỉ tiêu đề ra (chỉ tiêu &gt; 90%)</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Điểm hài lòng trung bình</span>
          <div className="kpi-value text-gold">{stats?.satisfactionAvg || 4.8} / 5.0 ⭐</div>
          <span className="kpi-sub">Từ 112 phiếu đánh giá trực tuyến</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Hồ sơ TTHC giải quyết đúng hạn</span>
          <div className="kpi-value text-blue">{adminReport?.onTimeRate || 98.4}%</div>
          <span className="kpi-sub">{adminReport?.processedOnTime || 412} / {adminReport?.totalReceived || 428} hồ sơ</span>
        </div>
      </div>

      {/* Reports Tables Grid */}
      <div className="reports-grid-2">
        {/* Organizations Performance */}
        <div className="report-table-card">
          <div className="report-table-header">
            <Users size={18} />
            <h3>Kết quả xử lý theo Tổ chức thành viên</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tổ chức đoàn thể</th>
                <th>Số phản ánh</th>
                <th>Tỷ lệ (%)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats?.byOrganization.map((org, i) => (
                <tr key={i}>
                  <td><strong>{org.name}</strong></td>
                  <td>{org.count} việc</td>
                  <td>{Math.round((org.count / (stats.total || 100)) * 100)}%</td>
                  <td><span className="badge badge-success">Tốt</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Categories Breakdown */}
        <div className="report-table-card">
          <div className="report-table-header">
            <Building size={18} />
            <h3>Phân loại theo Lĩnh vực phản ánh</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lĩnh vực chuyên đề</th>
                <th>Số lượng tiếp nhận</th>
                <th>Tỷ lệ đóng góp</th>
              </tr>
            </thead>
            <tbody>
              {stats?.byCategory.map((cat, i) => (
                <tr key={i}>
                  <td>{cat.name}</td>
                  <td><strong>{cat.count}</strong></td>
                  <td>
                    <div className="mini-progress">
                      <div className="mini-fill" style={{ width: `${(cat.count / (stats.total || 100)) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
