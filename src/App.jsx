import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { NotificationProvider } from "./contexts/notification-context";
import { ResponseEvaluationProvider } from "./contexts/response-evaluation-context";
import { ExamProvider } from "./contexts/exam-context";
import { FacultyProvider } from "./contexts/faculty-context";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AllEventsPage from "./pages/AllEventsPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dashboard from "./pages/AdminDashboardPage.jsx";
import AdminSignup from "./components/auth/AdminSignup.jsx";
import ExamPage from "./pages/ExamPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CorsWarning from "./components/ui/cors-warning.jsx";
import NotificationCenter from "./components/common/notification-center";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationCenter />
        <ResponseEvaluationProvider>
          <ExamProvider>
            <FacultyProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected User Routes */}
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <AllEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams"
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <ExamPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requireAdmin={false}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/signup"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSignup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>

              {/* CORS Warning component */}
              <CorsWarning />
            </FacultyProvider>
          </ExamProvider>
        </ResponseEvaluationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
