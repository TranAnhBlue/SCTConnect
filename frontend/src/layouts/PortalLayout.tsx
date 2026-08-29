import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_LOGO } from '../assets/images';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Layers,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart3,
  Users
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sct_sidebar_collapsed') === 'true';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isCitizen = user.userType === 'citizen' || (user as any).role === 'citizen';
  const isAdmin = user.userType === 'admin';
  const isOfficer = user.userType === 'officer';

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sct_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Cấu hình menu với URL tiếng Việt thân thiện:
  const navItems = [
    { label: 'Bảng tổng quan', path: '/he-thong/tong-quan', icon: LayoutDashboard },
    {
      label: isCitizen ? 'Phản ánh của tôi' : 'Quản lý Phản ánh',
      path: '/he-thong/phan-anh',
      icon: FileText
    },
    { label: 'Gửi phản ánh mới', path: '/he-thong/phan-anh/gui-moi', icon: PlusCircle },

    // Cán bộ & Admin
    ...(isAdmin || isOfficer
      ? [
          { label: 'Tổ chức & Địa bàn', path: '/he-thong/to-chuc-dia-ban', icon: Layers },
          { label: 'Báo cáo & Thống kê', path: '/he-thong/bao-cao-thong-ke', icon: BarChart3 }
        ]
      : []),

    // Độc quyền cho Admin
    ...(isAdmin ? [{ label: 'Quản lý Người dùng', path: '/he-thong/nguoi-dung', icon: Users }] : [])
  ];

  return (
    <div className={`portal-container ${isCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" title="SCT Connect">
            <img src={BRAND_LOGO} alt="SCT Connect" className="sidebar-logo" />
          </Link>

          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <button
            type="button"
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isExact = location.pathname === item.path;
            const isNestedDetail =
              item.path === '/he-thong/phan-anh' &&
              location.pathname.startsWith('/he-thong/phan-anh/') &&
              location.pathname !== '/he-thong/phan-anh/gui-moi';
            const isActive = isExact || isNestedDetail;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="nav-item-icon" />
                {!isCollapsed && <span className="nav-item-text">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link
            to="/he-thong/ho-so"
            className={`nav-item ${location.pathname === '/he-thong/ho-so' ? 'active' : ''}`}
            title={isCollapsed ? 'Hồ sơ cá nhân' : undefined}
            onClick={() => setSidebarOpen(false)}
          >
            <User size={17} className="nav-item-icon" />
            {!isCollapsed && <span className="nav-item-text">Hồ sơ cá nhân</span>}
          </Link>
          <button
            type="button"
            className="nav-item logout-btn"
            onClick={() => {
              logout();
              navigate('/dang-nhap');
            }}
            title={isCollapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut size={17} className="nav-item-icon" />
            {!isCollapsed && <span className="nav-item-text">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="portal-main">
        {/* Topbar */}
        <header className="portal-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="topbar-right">
            {/* User Menu */}
            <div className="user-menu-wrap">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setUserMenuOpen(prev => !prev)}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isAdmin ? '#1d4ed8' : isOfficer ? '#d97706' : 'var(--blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {(user.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="top-username">
                  {user?.fullName ? user.fullName.split(' ').slice(-2).join(' ') : 'Tài khoản'}
                </span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className="dropdown-menu user-dropdown">
                  <div className="dropdown-user-info">
                    <strong>{user?.fullName || 'Người dùng'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                      {isAdmin ? '🛡️ Quản trị viên' : isOfficer ? '🏛️ Cán bộ cơ sở' : '👤 Công dân'}
                    </div>
                  </div>
                  <Link
                    to="/he-thong/ho-so"
                    className="dropdown-item-link"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={16} />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item-link text-danger"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/dang-nhap');
                    }}
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
