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
    return <Navigate to="/he-thong/tong-quan" replace />;
  }
  return <>{children}</>;
};

const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.userType === 'admin';
  if (!isAdmin) {
    return <Navigate to="/he-thong/tong-quan" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public URLs bằng Tiếng Việt */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />

          {/* Hỗ trợ URL cũ để không bị gãy link */}
          <Route path="/login" element={<Navigate to="/dang-nhap" replace />} />
          <Route path="/register" element={<Navigate to="/dang-ky" replace />} />
          <Route path="/portal/*" element={<Navigate to="/he-thong/tong-quan" replace />} />

          {/* Cổng hệ thống /he-thong */}
          <Route path="/he-thong" element={<PortalLayout />}>
            <Route index element={<Navigate to="/he-thong/tong-quan" replace />} />

            {/* Dùng chung cho tất cả các role đã đăng nhập */}
            <Route path="tong-quan" element={<DashboardPage />} />
            <Route path="phan-anh" element={<FeedbacksListPage />} />
            <Route path="phan-anh/gui-moi" element={<CreateFeedbackPage />} />
            <Route path="phan-anh/:id" element={<FeedbackDetailPage />} />
            <Route path="ho-so" element={<ProfilePage />} />

            {/* Dành cho Cán bộ cơ sở & Quản trị viên: Tổ chức & Địa bàn, Báo cáo */}
            <Route
              path="to-chuc-dia-ban"
              element={
                <OfficerOrAdminRoute>
                  <AdministrativePage />
                </OfficerOrAdminRoute>
              }
            />
            <Route
              path="bao-cao-thong-ke"
              element={
                <OfficerOrAdminRoute>
                  <ReportsPage />
                </OfficerOrAdminRoute>
              }
            />

            {/* Dành độc quyền cho Quản trị viên (Admin): Quản lý người dùng */}
            <Route
              path="nguoi-dung"
              element={
                <AdminOnlyRoute>
                  <UsersManagementPage />
                </AdminOnlyRoute>
              }
            />

            {/* Chuyển hướng các alias cũ */}
            <Route path="dashboard" element={<Navigate to="/he-thong/tong-quan" replace />} />
            <Route path="feedbacks" element={<Navigate to="/he-thong/phan-anh" replace />} />
            <Route path="feedbacks/create" element={<Navigate to="/he-thong/phan-anh/gui-moi" replace />} />
            <Route path="administrative" element={<Navigate to="/he-thong/to-chuc-dia-ban" replace />} />
            <Route path="organizations" element={<Navigate to="/he-thong/to-chuc-dia-ban" replace />} />
            <Route path="catalog" element={<Navigate to="/he-thong/to-chuc-dia-ban" replace />} />
            <Route path="reports" element={<Navigate to="/he-thong/bao-cao-thong-ke" replace />} />
            <Route path="users" element={<Navigate to="/he-thong/nguoi-dung" replace />} />
            <Route path="profile" element={<Navigate to="/he-thong/ho-so" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
