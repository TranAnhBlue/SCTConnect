import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BRAND_LOGO } from '../assets/images';
import { notificationService } from '../services/notificationService';
import { INotification, UserRole } from '../types/api';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MapPin,
  Users,
  Calendar,
  Layers,
  BarChart3,
  MessageSquare,
  Bell,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const PortalLayout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sct_sidebar_collapsed') === 'true';
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sct_sidebar_collapsed', String(next));
      return next;
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const navItems = [
    { label: 'Bảng tổng quan', path: '/portal/dashboard', icon: LayoutDashboard },
    { label: 'Phản ánh kiến nghị', path: '/portal/feedbacks', icon: FileText, badge: '18 mới' },
    { label: 'Gửi phản ánh mới', path: '/portal/feedbacks/create', icon: PlusCircle },
    { label: 'Bản đồ địa bàn', path: '/portal/map', icon: MapPin },
    { label: 'Diễn đàn & Khảo sát', path: '/portal/community', icon: Users },
    { label: 'Tiếp dân trực tuyến', path: '/portal/receptions', icon: Calendar },
    { label: 'Dịch vụ & Thủ tục', path: '/portal/services', icon: Layers },
    { label: 'Báo cáo & Thống kê', path: '/portal/reports', icon: BarChart3 },
    { label: 'Hộp thư trao đổi', path: '/portal/messages', icon: MessageSquare },
    { label: 'Thông báo', path: '/portal/notifications', icon: Bell, badgeCount: unreadCount }
  ];

  const rolesList: { role: UserRole; name: string; title: string }[] = [
    { role: 'mttq_president', name: 'Đ/c Nguyễn Văn Minh', title: 'Chủ tịch Ủy ban MTTQ Xã' },
    { role: 'youth_leader', name: 'Đ/c Lê Hoàng Nam', title: 'Bí thư Đoàn Thanh niên' },
    { role: 'women_leader', name: 'Đ/c Phạm Thị Mai', title: 'Chủ tịch Hội Phụ nữ' },
    { role: 'veteran_leader', name: 'Đ/c Trần Văn Hùng', title: 'Chủ tịch Hội Cựu chiến binh' },
    { role: 'citizen', name: 'Bác Trần Văn An', title: 'Người dân cơ sở' }
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
          <Link to="/" className="sidebar-brand" title="SCT Connect - Cổng Dân Vận Số">
            <img src={BRAND_LOGO} alt="SCT Connect" className="sidebar-logo" />
          </Link>

          {/* Collapse/Expand Toggle Button on Desktop */}
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
            aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Close Button on Mobile */}
          <button
            type="button"
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/portal/dashboard' && location.pathname.startsWith(item.path));
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
                {!isCollapsed && item.badge && <span className="item-badge">{item.badge}</span>}
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className={`item-badge-count ${isCollapsed ? 'compact' : ''}`}>{item.badgeCount}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer in Sidebar */}
        <div className="sidebar-footer">
          <Link to="/" className="nav-item external-link" title={isCollapsed ? "Trang giới thiệu" : undefined}>
            <ExternalLink size={17} className="nav-item-icon" />
            {!isCollapsed && <span className="nav-item-text">Trang giới thiệu</span>}
          </Link>
          <button type="button" className="nav-item logout-btn" onClick={logout} title={isCollapsed ? "Đăng xuất" : undefined}>
            <LogOut size={17} className="nav-item-icon" />
            {!isCollapsed && <span className="nav-item-text">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Top Navbar */}
        <header className="portal-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="toggle-sidebar-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle mobile menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="topbar-right">
            {/* Quick Role Switcher */}
            <div className="role-switcher-wrap">
              <button
                type="button"
                className="role-switcher-btn"
                onClick={() => setRoleMenuOpen(prev => !prev)}
              >
                <Sparkles size={16} className="sparkle-icon" />
                <span className="role-text">Đổi vai trò: <strong>{user.titleName || user.fullName}</strong></span>
                <ChevronDown size={14} />
              </button>

              {roleMenuOpen && (
                <div className="dropdown-menu role-menu">
                  <div className="dropdown-title">Chuyển đổi vai trò trải nghiệm</div>
                  {rolesList.map(r => (
                    <button
                      key={r.role}
                      type="button"
                      className={`dropdown-item ${user.role === r.role ? 'selected' : ''}`}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                    >
                      <div>
                        <strong>{r.title}</strong>
                        <small>{r.name}</small>
                      </div>
                      {user.role === r.role && <CheckCircle2 size={16} className="check-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="notifications-wrap">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setNotificationsOpen(prev => !prev)}
                aria-label="Thông báo"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
              </button>

              {notificationsOpen && (
                <div className="dropdown-menu notif-menu">
                  <div className="dropdown-header">
                    <strong>Thông báo ({notifications.length})</strong>
                    {unreadCount > 0 && (
                      <button type="button" className="text-action" onClick={handleMarkAllRead}>
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                        <small>{new Date(n.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <Link to="/portal/notifications" onClick={() => setNotificationsOpen(false)}>
                      Xem tất cả thông báo
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="user-menu-wrap">
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setUserMenuOpen(prev => !prev)}
              >
                <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt={user.fullName} className="top-avatar" />
                <span className="top-username">{user.fullName.split(' ').slice(-2).join(' ')}</span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <div className="dropdown-menu user-dropdown">
                  <div className="dropdown-user-info">
                    <strong>{user.fullName}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link
                    to="/portal/profile"
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
                      navigate('/login');
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
