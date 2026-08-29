import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { villageService } from '../services/villageService';
import { IVillage } from '../types/api';
import { useMessage } from '../hooks/useMessage';
import { PasswordInput } from '../components/PasswordInput';
import {
  Phone,
  Building,
  MapPin,
  ShieldCheck,
  Save,
  KeyRound,
  Lock,
  User
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const { message } = useMessage();

  const [villages, setVillages] = useState<IVillage[]>([]);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [villageId, setVillageId] = useState(user?.villageId || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    villageService.getVillages().then(setVillages);
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setVillageId(user.villageId || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      message.warning('Họ và tên không được để trống');
      return;
    }
    setProfileLoading(true);
    const key = 'update-profile';
    message.loading({ content: 'Đang lưu cập nhật hồ sơ...', key });
    try {
      const updated = await authService.updateProfile({
        fullName: fullName.trim(),
        villageId: villageId || undefined
      });
      updateCurrentUser(updated ? updated : { fullName: fullName.trim(), villageId: villageId || undefined });
      message.success({ content: 'Cập nhật thông tin hồ sơ thành công! 🎉', key, duration: 3 });
    } catch (err: any) {
      message.error({ content: err?.response?.data?.message || err?.message || 'Không thể cập nhật hồ sơ', key, duration: 5 });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) { message.warning('Vui lòng nhập mật khẩu hiện tại'); return; }
    if (newPassword.length < 8) { message.error('Mật khẩu mới phải chứa tối thiểu 8 ký tự'); return; }
    if (newPassword !== confirmNewPassword) { message.error('Xác nhận mật khẩu mới không trùng khớp'); return; }

    setPasswordLoading(true);
    const key = 'change-password';
    message.loading({ content: 'Đang xử lý đổi mật khẩu...', key });
    try {
      const res = await authService.changePassword({ oldPassword, newPassword, confirmNewPassword });
      message.success({ content: res.message || 'Đổi mật khẩu thành công! 🔒', key, duration: 3 });
      setOldPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (err: any) {
      message.error({ content: err?.response?.data?.message || err?.message || 'Mật khẩu cũ không chính xác', key, duration: 5 });
    } finally {
      setPasswordLoading(false);
    }
  };

  const currentVillageName = villages.find(v => v.id === villageId)?.name || user?.village?.name;
  const userTypeLabel = user?.userType === 'admin' ? 'Quản trị viên (Admin)' : user?.userType === 'officer' ? 'Cán bộ cơ sở' : 'Công dân';
  const initial = (user?.fullName || 'C').charAt(0).toUpperCase();

  return (
    <div className="profile-page-container">
      <div style={{ marginBottom: 24 }}>
        <h2>Hồ Sơ Tài Khoản Cá Nhân</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
          Quản lý thông tin định danh và bảo mật mật khẩu trong hệ thống SCT Connect
        </p>
      </div>

      <div className="profile-grid-layout">
        {/* Left: Avatar & Info */}
        <div>
          <div className="profile-card">
            <div className="profile-card-body" style={{ textAlign: 'center', padding: 24 }}>
              {/* Avatar */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'var(--blue)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 700, margin: '0 auto 14px'
              }}>
                {initial}
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem' }}>{user?.fullName || 'Công dân'}</h3>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'var(--blue-soft)', color: 'var(--blue)', borderRadius: 20,
                padding: '4px 12px', fontSize: '0.82rem', marginBottom: 16
              }}>
                <ShieldCheck size={13} />
                <span>{user?.titleName || userTypeLabel}</span>
              </div>

              {/* Info rows - all inline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                  <Phone size={15} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{user?.phone || 'Chưa cập nhật'}</span>
                </div>
                {user?.organization && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                    <Building size={15} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                    <span>{user.organization.name}</span>
                  </div>
                )}
                {currentVillageName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                    <MapPin size={15} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                    <span>{currentVillageName}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
                  <User size={15} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                  <span>{userTypeLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Form 1: Update profile */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <User size={18} style={{ color: 'var(--blue)' }} />
                <span>Cập Nhật Thông Tin Cá Nhân</span>
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="profile-card-body">
              <div className="profile-form-grid-2">
                <div className="form-group">
                  <label htmlFor="pf-name">Họ và tên đầy đủ <span className="req">*</span></label>
                  <input id="pf-name" type="text" required minLength={2} maxLength={255}
                    value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn An" />
                </div>
                <div className="form-group">
                  <label htmlFor="pf-phone">Số điện thoại (Cố định)</label>
                  <input id="pf-phone" type="text" disabled value={user?.phone}
                    style={{ background: 'var(--paper)', cursor: 'not-allowed', color: 'var(--ink-soft)' }} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pf-village">Thôn / Tổ dân phố cư trú</label>
                <select id="pf-village" value={villageId} onChange={e => setVillageId(e.target.value)}>
                  <option value="">{villages.length === 0 ? 'Đang tải...' : '-- Chọn Thôn / Tổ dân phố --'}</option>
                  {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pf-role">Loại tài khoản</label>
                <input id="pf-role" type="text" disabled value={userTypeLabel}
                  style={{ background: 'var(--paper)', cursor: 'not-allowed' }} />
              </div>

              <div className="profile-form-actions">
                <button type="submit" className="cta-btn" disabled={profileLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Save size={16} />
                  <span>{profileLoading ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Change password */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <KeyRound size={18} style={{ color: 'var(--blue)' }} />
                <span>Đổi Mật Khẩu Cá Nhân</span>
              </h3>
            </div>
            <form onSubmit={handleChangePassword} className="profile-card-body">
              <div className="form-group">
                <label htmlFor="old-pass">Mật khẩu hiện tại <span className="req">*</span></label>
                <PasswordInput id="old-pass" required placeholder="Nhập mật khẩu hiện tại"
                  value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div className="profile-form-grid-2">
                <div className="form-group">
                  <label htmlFor="new-pass">Mật khẩu mới (tối thiểu 8 ký tự) <span className="req">*</span></label>
                  <PasswordInput id="new-pass" required minLength={8} placeholder="Nhập mật khẩu mới"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-new-pass">Xác nhận mật khẩu mới <span className="req">*</span></label>
                  <PasswordInput id="confirm-new-pass" required minLength={8} placeholder="Nhập lại mật khẩu mới"
                    value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                </div>
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="cta-btn" disabled={passwordLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={16} />
                  <span>{passwordLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu tài khoản'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
