import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortalLayout } from './layouts/PortalLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeedbacksListPage } from './pages/FeedbacksListPage';
import { CreateFeedbackPage } from './pages/CreateFeedbackPage';
import { FeedbackDetailPage } from './pages/FeedbackDetailPage';
import { FeedbackMapPage } from './pages/FeedbackMapPage';
import { ReportsPage } from './pages/ReportsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ReceptionsPage } from './pages/ReceptionsPage';
import { ServicesPage } from './pages/ServicesPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Administrative and Citizen Web Portal */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="feedbacks" element={<FeedbacksListPage />} />
            <Route path="feedbacks/create" element={<CreateFeedbackPage />} />
            <Route path="feedbacks/:id" element={<FeedbackDetailPage />} />
            <Route path="map" element={<FeedbackMapPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="receptions" element={<ReceptionsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
