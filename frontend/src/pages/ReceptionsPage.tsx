import React, { useState, useEffect } from 'react';
import { receptionService } from '../services/receptionService';
import { useAuth } from '../context/AuthContext';
import { ICitizenReception } from '../types/api';
import {
  Calendar,
  Clock,
  User,
  Phone,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText
} from 'lucide-react';

export const ReceptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [receptions, setReceptions] = useState<ICitizenReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form State
  const [citizenName, setCitizenName] = useState(user.fullName || '');
  const [citizenPhone, setCitizenPhone] = useState(user.phone || '');
  const [address, setAddress] = useState('Thôn 2, Xã Thanh Oai');
  const [receptionDate, setReceptionDate] = useState('2026-08-28');
  const [timeSlot, setTimeSlot] = useState('08:30 - 09:30');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [hostLeaderName, setHostLeaderName] = useState('Đ/c Nguyễn Văn Minh - Chủ tịch MTTQ Xã');

  useEffect(() => {
    loadReceptions();
  }, []);

  const loadReceptions = async () => {
    setLoading(true);
    try {
      const data = await receptionService.getReceptions();
      setReceptions(data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    await receptionService.createReception({
      citizenName,
      citizenPhone,
      address,
      receptionDate,
      timeSlot,
      topic,
      content,
      hostLeaderName: hostLeaderName.split(' - ')[0],
      hostLeaderTitle: hostLeaderName.split(' - ')[1] || 'Lãnh đạo MTTQ'
    });
    setTopic('');
    setContent('');
    setShowBookingModal(false);
    loadReceptions();
  };

  const handleUpdateStatus = async (id: string, status: ICitizenReception['status']) => {
    await receptionService.updateStatus(id, status);
    loadReceptions();
  };

  const isOfficer = user.role !== 'citizen';

  return (
    <div className="receptions-page">
      <div className="page-header-row">
        <div>
          <h2>Lịch Tiếp Dân &amp; Đối Thoại Trực Tuyến</h2>
          <p className="page-sub">Đăng ký và theo dõi các phiên đối thoại trực tiếp với Thường trực MTTQ và Lãnh đạo UBND xã</p>
        </div>
        <button type="button" className="cta-btn" onClick={() => setShowBookingModal(true)}>
          <PlusCircle size={16} />
          <span>Đăng ký lịch tiếp dân</span>
        </button>
      </div>

      {/* Receptions Grid */}
      <div className="receptions-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải danh sách lịch tiếp dân...</p>
          </div>
        ) : (
          receptions.map((rec) => (
            <div key={rec.id} className="rec-card">
              <div className="rec-card-top">
                <span className="code-pill">{rec.code}</span>
                <span className={`badge badge-${rec.status === 'confirmed' ? 'success' : rec.status === 'completed' ? 'neutral' : 'warning'}`}>
                  {rec.status === 'confirmed' ? '✓ Đã xác nhận' : rec.status === 'completed' ? 'Đã hoàn thành' : '⏳ Chờ duyệt'}
                </span>
              </div>

              <h3 className="rec-topic">{rec.topic}</h3>
              <p className="rec-desc">{rec.content}</p>

              <div className="rec-details-box">
                <div className="rec-detail-line">
                  <User size={14} />
                  <span>Người đăng ký: <strong>{rec.citizenName}</strong> ({rec.citizenPhone})</span>
                </div>
                <div className="rec-detail-line">
                  <Calendar size={14} />
                  <span>Ngày tiếp: <strong>{rec.receptionDate}</strong></span>
                </div>
                <div className="rec-detail-line">
                  <Clock size={14} />
                  <span>Khung giờ: <strong>{rec.timeSlot}</strong></span>
                </div>
                <div className="rec-detail-line">
                  <FileText size={14} />
                  <span>Cán bộ chủ trì: <strong>{rec.hostLeaderName}</strong></span>
                </div>
              </div>

              {rec.note && (
                <div className="rec-note-box">
                  <strong>Ghi chú:</strong> {rec.note}
                </div>
              )}

              {isOfficer && (
                <div className="rec-actions">
                  {rec.status === 'pending' && (
                    <button
                      type="button"
                      className="cta-btn sm bg-success"
                      onClick={() => handleUpdateStatus(rec.id, 'confirmed')}
                    >
                      Duyệt tiếp nhận
                    </button>
                  )}
                  {rec.status === 'confirmed' && (
                    <button
                      type="button"
                      className="cta-ghost sm"
                      onClick={() => handleUpdateStatus(rec.id, 'completed')}
                    >
                      Hoàn thành buổi tiếp
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay open" onClick={() => setShowBookingModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
            <h3>Đăng ký lịch tiếp dân trực tuyến</h3>
            <p className="modal-sub">Vui lòng điền nội dung cần đối thoại để văn phòng MTTQ sắp xếp lịch chu đáo</p>

            <form onSubmit={handleCreateBooking}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Ngày mong muốn tiếp</label>
                  <input
                    type="date"
                    required
                    value={receptionDate}
                    onChange={(e) => setReceptionDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Khung giờ</label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                    <option value="08:30 - 09:30">08:30 - 09:30</option>
                    <option value="09:45 - 10:45">09:45 - 10:45</option>
                    <option value="14:00 - 15:00">14:00 - 15:00</option>
                    <option value="15:15 - 16:15">15:15 - 16:15</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Lãnh đạo tiếp công dân mong muốn</label>
                <select value={hostLeaderName} onChange={(e) => setHostLeaderName(e.target.value)}>
                  <option value="Đ/c Nguyễn Văn Minh - Chủ tịch MTTQ Xã">Đ/c Nguyễn Văn Minh - Chủ tịch MTTQ Xã</option>
                  <option value="Đ/c Phạm Thị Mai - Chủ tịch Hội Phụ nữ Xã">Đ/c Phạm Thị Mai - Chủ tịch Hội Phụ nữ Xã</option>
                  <option value="Đ/c Lê Hoàng Nam - Bí thư Đoàn Thanh niên Xã">Đ/c Lê Hoàng Nam - Bí thư Đoàn Thanh niên Xã</option>
                  <option value="Đ/c Trần Văn Hùng - Chủ tịch Hội Cựu chiến binh Xã">Đ/c Trần Văn Hùng - Chủ tịch Hội Cựu chiến binh Xã</option>
                </select>
              </div>

              <div className="form-group">
                <label>Chủ đề / Vấn đề kiến nghị *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thủ tục giải phóng mặt bằng, chính sách hỗ trợ hộ nghèo..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nội dung chi tiết</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tóm tắt nội dung thắc mắc hoặc đề xuất đối thoại..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="form-action-buttons">
                <button type="button" className="cta-ghost" onClick={() => setShowBookingModal(false)}>Hủy</button>
                <button type="submit" className="cta-btn">Gửi đăng ký lịch tiếp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
