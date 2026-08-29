import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalLayout } from './layouts/PortalLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbacksListPage } from './pages/FeedbacksListPage';
import { CreateFeedbackPage } from './pages/CreateFeedbackPage';
import { FeedbackDetailPage } from './pages/FeedbackDetailPage';
import { AdministrativePage } from './pages/AdministrativePage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { UsersManagementPage } from './pages/UsersManagementPage';

// Route Guard bảo vệ theo quyền Admin / Cán bộ
const OfficerOrAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'admin';
  const isOfficer = user?.userType === 'officer';
  if (!isAdmin && !isOfficer) {
    return <Navigate to="/portal/dashboard" replace />;
  }
  return <>{children}</>;
};

const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'admin';
  if (!isAdmin) {
    return <Navigate to="/portal/dashboard" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Portal */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />

            {/* Dùng chung cho tất cả các role đã đăng nhập */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="feedbacks" element={<FeedbacksListPage />} />
            <Route path="feedbacks/create" element={<CreateFeedbackPage />} />
            <Route path="feedbacks/:id" element={<FeedbackDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Dành cho Cán bộ cơ sở & Quản trị viên: Quản trị Tổ chức & Địa bàn cấp xã */}
            <Route
              path="administrative"
              element={
                <OfficerOrAdminRoute>
                  <AdministrativePage />
                </OfficerOrAdminRoute>
              }
            />
            {/* Tương thích ngược: Nếu ai bấm /organizations thì chuyển về /administrative */}
            <Route path="organizations" element={<Navigate to="/portal/administrative" replace />} />
            <Route path="catalog" element={<Navigate to="/portal/administrative" replace />} />

            <Route
              path="reports"
              element={
                <OfficerOrAdminRoute>
                  <ReportsPage />
                </OfficerOrAdminRoute>
              }
            />

            {/* Dành độc quyền cho Quản trị viên (Admin): Quản lý tài khoản toàn xã */}
            <Route
              path="users"
              element={
                <AdminOnlyRoute>
                  <UsersManagementPage />
                </AdminOnlyRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
