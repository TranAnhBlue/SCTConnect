import React, { useState, useEffect } from 'react';
import { publicService } from '../services/publicService';
import { IPublicService } from '../types/api';
import {
  Layers,
  Clock,
  DollarSign,
  FileCheck,
  Building,
  CheckCircle2,
  ExternalLink,
  Search,
  ArrowRight
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<IPublicService[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<IPublicService | null>(null);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const data = await publicService.getServices();
        setServices(data);
        if (data.length > 0) setSelectedService(data[0]);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="services-page">
      <div className="page-header-row">
        <div>
          <h2>Danh Mục Dịch Vụ Công &amp; Thủ Tục Hành Chính</h2>
          <p className="page-sub">Tra cứu quy trình, thành phần hồ sơ và nộp hồ sơ trực tuyến cấp xã/phường</p>
        </div>
      </div>

      <div className="filter-card">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm thủ tục hành chính (VD: kết hôn, trợ cấp hộ nghèo, đất đai)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="services-layout-grid">
        {/* Left: List of Services */}
        <div className="services-list-col">
          {filtered.map((s) => {
            const isSelected = selectedService?.id === s.id;
            return (
              <div
                key={s.id}
                className={`service-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedService(s)}
              >
                <div className="service-card-top">
                  <span className="code-pill">{s.code}</span>
                  <span className="badge badge-blue">{s.category}</span>
                </div>
                <h3 className="service-name">{s.name}</h3>
                <p className="service-sub">{s.description}</p>
                <div className="service-meta-row">
                  <span><Clock size={12} /> {s.processingTimeDays} ngày làm việc</span>
                  <span><DollarSign size={12} /> {s.fee === 0 ? 'Miễn phí' : `${s.fee.toLocaleString()} đ`}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Service Detail & Steps */}
        <div className="service-detail-col">
          {selectedService ? (
            <div className="service-detail-card">
              <div className="detail-card-head">
                <span className="code-pill">{selectedService.code}</span>
                <h2>{selectedService.name}</h2>
                <div className="service-tag-row">
                  <span className="tag-pill bg-paper"><Building size={12} /> {selectedService.department}</span>
                  <span className="tag-pill bg-blue-soft"><Clock size={12} /> Thời hạn: {selectedService.processingTimeDays} ngày</span>
                  <span className="tag-pill bg-gold-soft"><DollarSign size={12} /> Lệ phí: {selectedService.fee === 0 ? 'Miễn phí' : `${selectedService.fee.toLocaleString()} VNĐ`}</span>
                </div>
              </div>

              <div className="service-section">
                <h3>Thành phần hồ sơ cần chuẩn bị:</h3>
                <ul className="doc-checklist">
                  {selectedService.requiredDocuments.map((doc, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} className="text-success" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="service-section">
                <h3>Trình tự các bước thực hiện:</h3>
                <div className="steps-vertical">
                  {selectedService.steps.map((step, i) => (
                    <div key={i} className="step-vertical-item">
                      <div className="step-badge">{i + 1}</div>
                      <div className="step-text">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-action-banner">
                <button
                  type="button"
                  className="cta-btn full"
                  onClick={() => alert(`Đã chuyển hướng nộp hồ sơ dịch vụ: ${selectedService.name}`)}
                >
                  <span>Nộp hồ sơ trực tuyến ngay</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Chọn một thủ tục bên trái để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
