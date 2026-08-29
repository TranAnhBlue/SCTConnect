import React, { useState, useEffect, useCallback } from 'react';
import { userService, IUserItem } from '../services/userService';
import { organizationService } from '../services/organizationService';
import { IOrganization } from '../types/api';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  UserCog,
  Save,
  X
} from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  admin: '🛡️ Admin',
  officer: '🏛️ Cán bộ',
  citizen: '👤 Công dân'
};

const ROLE_BADGE: Record<string, string> = {
  admin: 'badge-blue',
  officer: 'badge-warning',
  citizen: 'badge-neutral'
};

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<IUserItem[]>([]);
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'officer' | 'citizen'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);

  // Modal phân vai trò
  const [roleModal, setRoleModal] = useState<{ open: boolean; user?: IUserItem | null }>({ open: false });
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'officer' | 'admin'>('citizen');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [roleError, setRoleError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const result = await userService.getUsers({
      page,
      limit: 20,
      search: search || undefined,
      userType: filterType === 'all' ? undefined : filterType,
      isActive: filterStatus === 'all' ? undefined : filterStatus === 'active'
    });
    setUsers(result.items);
    setPagination(result.pagination);
    setLoading(false);
  }, [page, search, filterType, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  // Tải danh sách tổ chức để gán cho cán bộ
  useEffect(() => {
    organizationService.getList().then(setOrganizations);
  }, []);

  const handleToggleStatus = async (u: IUserItem) => {
    if (u.userType === 'admin') return; // Không khóa admin
    setTogglingId(u.id);
    await userService.toggleUserStatus(u.id, !u.isActive);
    setTogglingId(null);
    setUsers(prev => prev.map(item => item.id === u.id ? { ...item, isActive: !item.isActive } : item));
  };

  // Mở modal phân quyền
  const handleOpenRoleModal = (u: IUserItem) => {
    setRoleModal({ open: true, user: u });
    setSelectedRole(u.userType);
    setSelectedOrgId(u.organization?.id || '');
    setRoleError('');
  };

  // Lưu phân quyền
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModal.user) return;

    if (selectedRole === 'officer' && !selectedOrgId) {
      setRoleError('Vui lòng chọn Tổ chức / Hội đoàn mà cán bộ này phụ trách');
      return;
    }

    setRoleUpdating(true);
    setRoleError('');
    try {
      await userService.updateUserRole(roleModal.user.id, {
        userType: selectedRole,
        organizationId: selectedRole === 'officer' ? selectedOrgId : null
      });
      setRoleModal({ open: false });
      await loadUsers();
    } catch (err: any) {
      setRoleError(err?.response?.data?.message || 'Cập nhật vai trò thất bại');
    } finally {
      setRoleUpdating(false);
    }
  };

  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = users.filter(u => !u.isActive).length;

  return (
    <div className="users-page">
      <div className="page-header-row">
        <div>
          <h2>Quản Lý Tài Khoản Người Dùng</h2>
          <p className="page-sub">
            Tổng <strong>{pagination.totalItems}</strong> tài khoản ·{' '}
            <span style={{ color: 'var(--success)' }}>{activeCount} hoạt động</span> ·{' '}
            <span style={{ color: 'var(--ink-soft)' }}>{inactiveCount} bị khóa</span>
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-card">
        <div className="filter-controls">
          <div className="search-bar" style={{ flex: 2 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && <button type="button" className="clear-btn" onClick={() => setSearch('')}>✕</button>}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--ink-soft)' }} />
            <select
              value={filterType}
              onChange={e => { setFilterType(e.target.value as any); setPage(1); }}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line)', fontSize: '0.88rem' }}
            >
              <option value="all">Tất cả loại</option>
              <option value="admin">Admin</option>
              <option value="officer">Cán bộ</option>
              <option value="citizen">Công dân</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value as any); setPage(1); }}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line)', fontSize: '0.88rem' }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-state" style={{ padding: 48 }}>
            <div className="spinner" />
            <p>Đang tải danh sách người dùng...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state" style={{ border: 'none' }}>
            <Users size={40} style={{ color: 'var(--ink-soft)' }} />
            <h3>Không tìm thấy người dùng nào</h3>
            <p>Thử thay đổi bộ lọc tìm kiếm</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Thôn</th>
                <th>Đăng nhập gần nhất</th>
                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} style={{ opacity: u.isActive ? 1 : 0.6 }}>
                  <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                    {(page - 1) * 20 + idx + 1}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{u.fullName}</span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.88rem' }}>
                      <Phone size={12} style={{ color: 'var(--ink-soft)' }} />
                      {u.phone}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ROLE_BADGE[u.userType] || 'badge-neutral'}`}>
                      {ROLE_LABELS[u.userType] || u.userType}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', maxWidth: 180 }}>
                    {u.organization ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Building size={12} style={{ color: 'var(--blue)' }} /> {u.organization.name}
                      </span>
                    ) : u.village ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {u.village.name}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                    {u.lastLoginAt ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {new Date(u.lastLoginAt).toLocaleDateString('vi-VN')}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {u.isActive ? (
                      <span className="badge badge-success"><CheckCircle2 size={11} /> Hoạt động</span>
                    ) : (
                      <span className="badge badge-neutral"><XCircle size={11} /> Đã khóa</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {u.userType === 'admin' ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>—</span>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {/* Nút Phân vai trò (Chỉ cho Cán bộ & Công dân) */}
                        <button
                          type="button"
                          onClick={() => handleOpenRoleModal(u)}
                          title="Phân vai trò / Đổi quyền"
                          style={{
                            background: '#fff',
                            border: '1px solid var(--line)',
                            borderRadius: 6,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            color: 'var(--ink)'
                          }}
                        >
                          <UserCog size={13} style={{ color: 'var(--blue)' }} />
                          <span>Đổi vai trò</span>
                        </button>

                        {/* Nút Khóa / Mở */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          disabled={togglingId === u.id}
                          title={u.isActive ? 'Khóa tài khoản' : 'Mở tài khoản'}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: u.isActive ? 'var(--success)' : 'var(--ink-soft)',
                            padding: 4,
                            borderRadius: 6,
                            transition: 'all 0.15s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.82rem',
                            fontWeight: 600
                          }}
                        >
                          {togglingId === u.id ? (
                            <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: 0 }} />
                          ) : u.isActive ? (
                            <><ToggleRight size={20} style={{ color: 'var(--success)' }} /> Khóa</>
                          ) : (
                            <><ToggleLeft size={20} /> Mở</>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className="cta-ghost"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            style={{ padding: '7px 14px' }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
            Trang <strong>{page}</strong> / {pagination.totalPages}
            &nbsp;·&nbsp;{pagination.totalItems} bản ghi
          </span>
          <button
            type="button"
            className="cta-ghost"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{ padding: '7px 14px' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL PHÂN VAI TRÒ & GÁN HỘI ĐOÀN (PATCH /users/{id}/role) */}
      {/* ========================================================= */}
      {roleModal.open && roleModal.user && (
        <div className="app-modal-overlay" onClick={() => setRoleModal({ open: false })}>
          <div className="app-modal-box" onClick={e => e.stopPropagation()}>
            <div className="app-modal-header">
              <h3>Phân Quyền &amp; Gán Vai Trò</h3>
              <button
                type="button"
                className="app-modal-close-btn"
                onClick={() => setRoleModal({ open: false })}
              >
                <X size={18} />
              </button>
            </div>

            {roleError && (
              <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 16px', fontSize: '0.88rem', borderBottom: '1px solid #fed7d7' }}>
                {roleError}
              </div>
            )}

            <form onSubmit={handleSaveRole}>
              <div className="app-modal-body">
                {/* Thông tin người dùng */}
                <div style={{ background: 'var(--paper)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{roleModal.user.fullName}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                    SĐT: {roleModal.user.phone} · Thôn: {roleModal.user.village?.name || 'Chưa cập nhật'}
                  </div>
                </div>

                {/* Chọn vai trò */}
                <div className="form-group">
                  <label>Vai trò hệ thống <span className="req">*</span></label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as any)}
                  >
                    <option value="citizen">👤 Công dân (Chỉ gửi &amp; xem phản ánh của mình)</option>
                    <option value="officer">🏛️ Cán bộ cơ sở (Tiếp nhận &amp; xử lý phản ánh)</option>
                    <option value="admin">🛡️ Quản trị viên (Toàn quyền quản trị cấp xã)</option>
                  </select>
                </div>

                {/* Nếu chọn là Cán bộ -> Hiển thị chọn Tổ chức/Hội đoàn */}
                {selectedRole === 'officer' && (
                  <div className="form-group" style={{ animation: 'modalFadeIn 0.2s ease-out' }}>
                    <label>
                      Tổ chức / Hội đoàn tiếp nhận phản ánh <span className="req">*</span>
                    </label>
                    <select
                      value={selectedOrgId}
                      onChange={e => setSelectedOrgId(e.target.value)}
                      required
                    >
                      <option value="">-- Chỉ định Tổ chức / Hội đoàn --</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.code})
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: 4 }}>
                      Cán bộ sẽ chỉ nhận và xử lý các phản ánh của nhân dân gửi đích danh về Hội đoàn này.
                    </p>
                  </div>
                )}
              </div>

              <div className="app-modal-footer">
                <button
                  type="button"
                  className="cta-ghost"
                  onClick={() => setRoleModal({ open: false })}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="cta-btn"
                  disabled={roleUpdating}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={15} />
                  <span>{roleUpdating ? 'Đang lưu...' : 'Lưu phân quyền'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
