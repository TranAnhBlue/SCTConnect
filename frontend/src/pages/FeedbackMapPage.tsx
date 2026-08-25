import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';
import { IDistrictReport, IFeedback } from '../types/api';
import { MapPin, CheckCircle2, Clock, AlertTriangle, Layers, Navigation } from 'lucide-react';

export const FeedbackMapPage: React.FC = () => {
  const [districts, setDistricts] = useState<IDistrictReport[]>([]);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<IDistrictReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      try {
        const [distData, fbData] = await Promise.all([
          feedbackService.getDistrictMap(),
          feedbackService.getFeedbacks()
        ]);
        setDistricts(distData);
        setFeedbacks(fbData);
        if (distData.length > 0) setSelectedDistrict(distData[0]);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  return (
    <div className="map-page">
      <div className="page-header-row">
        <div>
          <h2>Bản Đồ Số Phân Bố Phản Ánh Địa Bàn</h2>
          <p className="page-sub">Theo dõi mật độ, tiến độ giải quyết và các điểm nóng phản ánh trên bản đồ cơ sở</p>
        </div>
      </div>

      {/* District Cards summary */}
      <div className="district-cards-grid">
        {districts.map((dist, idx) => {
          const isSelected = selectedDistrict?.districtName === dist.districtName;
          const rate = Math.round((dist.done / dist.total) * 100);
          return (
            <div
              key={idx}
              className={`district-card ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedDistrict(dist)}
            >
              <div className="dist-card-top">
                <strong>{dist.districtName}</strong>
                <span className="rate-badge">{rate}% Đã xong</span>
              </div>
              <div className="dist-stats-row">
                <span>Tổng: <strong>{dist.total}</strong></span>
                <span className="text-warning">Đang xử lý: <strong>{dist.processing}</strong></span>
                <span className="text-success">Hoàn thành: <strong>{dist.done}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map Visual Mockup */}
      <div className="map-visual-container">
        <div className="map-graphic-box">
          <div className="map-overlay-title">
            <Navigation size={18} />
            <span>Khu vực: <strong>{selectedDistrict?.districtName || 'Toàn xã Thanh Oai'}</strong></span>
          </div>

          {/* Simulated Map Markers */}
          <div className="simulated-map-canvas">
            <div className="map-grid-lines" />

            {feedbacks.map((fb, i) => {
              const leftPercent = 20 + ((i * 27) % 60);
              const topPercent = 25 + ((i * 33) % 50);
              return (
                <Link
                  to={`/portal/feedbacks/${fb.id}`}
                  key={fb.id}
                  className={`map-pin-marker ${fb.status}`}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  title={`${fb.reportCode}: ${fb.title}`}
                >
                  <MapPin size={24} />
                  <span className="pin-popup">{fb.reportCode}</span>
                </Link>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="map-legend">
            <div className="legend-item"><span className="dot dot-success" /> Đã hoàn thành</div>
            <div className="legend-item"><span className="dot dot-warning" /> Đang xử lý</div>
            <div className="legend-item"><span className="dot dot-danger" /> Chờ tiếp nhận</div>
          </div>
        </div>
      </div>
    </div>
  );
};
