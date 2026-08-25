import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [titleName, setTitleName] = useState(user.titleName || '');
  const [department, setDepartment] = useState(user.department || '');
  const [commune, setCommune] = useState(user.commune || 'Xã Thanh Oai');
  const [district, setDistrict] = useState(user.district || 'Huyện Thanh Oai');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile(user.id, {
        fullName,
        phone,
        email,
        titleName,
        department,
        commune,
        district
      });
      updateCurrentUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header-row">
        <div>
          <h2>Hồ Sơ Tài Khoản Cá Nhân</h2>
          <p className="page-sub">Quản lý thông tin định danh và quyền hạn trong hệ thống SCT Connect</p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left: Avatar Card */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-wrapper">
            <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} alt={user.fullName} className="profile-big-avatar" />
            <span className="verified-badge" title="Tài khoản đã xác thực">
              <ShieldCheck size={18} />
            </span>
          </div>

          <h3 className="profile-name">{user.fullName}</h3>
          <p className="profile-role-title">{user.titleName || 'Cán bộ'}</p>
          <span className="badge badge-success" style={{ marginTop: 8 }}>
            Đã kích hoạt &amp; Xác thực
          </span>

          <div className="profile-summary-meta">
            <div className="summary-item">
              <Building size={14} />
              <span>{user.department || 'Xã Thanh Oai'}</span>
            </div>
            <div className="summary-item">
              <MapPin size={14} />
              <span>{user.commune}, {user.district}</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <h3>Thông tin chi tiết</h3>
          </div>

          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email liên hệ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Chức danh / Vai trò hiển thị</label>
                <input
                  type="text"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Đơn vị công tác / Thôn xóm</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Xã / Phường</label>
                <input
                  type="text"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Quận / Huyện</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="cta-btn" disabled={loading}>
                <Save size={16} />
                <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ'}</span>
              </button>
              {savedSuccess && (
                <span className="save-success-msg">
                  <CheckCircle2 size={16} /> Cập nhật hồ sơ thành công!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
