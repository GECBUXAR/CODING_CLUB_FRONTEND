import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RedirectIfAuthenticated } from "./routes/RedirectIfAuthenticated";

// Public Pages
import LandingPage from "./pages/common/LandingPage";
import AboutPage from "./pages/common/AboutPage";
import ContactPage from "./pages/common/ContactPage";
import HomePage from "./pages/common/HomePage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import AdminSignupPage from "./pages/auth/AdminSignupPage.jsx";

// User Pages
import ProfilePage from "./pages/user/ProfilePage";
import ExamsPage from "./pages/user/ExamsPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import MyExamsPage from "./pages/user/MyExamsPage.jsx";
import ExamDetailPage from "./pages/user/ExamDetailPage";
import UserPerformancePage from "./pages/user/UserPerformancePage";

// Exam Components
import ExamResultsView from "./components/exams/ExamResultsView";
import ExamLeaderboard from "./components/exams/ExamLeaderboard";

// Event Pages
import EventsPage from "./pages/user/EventsPage";
import EventDetailPage from "./pages/user/EventDetailPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { AdminExamPanel } from "./pages/admin/AdminExamPanel";
import AdminExamStatisticsPage from "./pages/admin/AdminExamStatisticsPage";
import ExamResponseEvaluator from "./components/admin/exam-response-evaluator";

// Error Pages
import NotFoundPage from "./pages/errors/NotFoundPage";
import CorsWarning from "./components/common/cors-warning";

// User Route - allows both regular users and admins
const UserRoute = ({ children }) => {
  return <ProtectedRoute requiredRole={null}>{children}</ProtectedRoute>;
};

// Admin Route - only allows admins
const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

// User-only Route - only allows regular users, not admins
const UserOnlyRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <RedirectIfAuthenticated>
            <LandingPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin-signup" element={<AdminSignupPage />} />
      <Route
        path="/home"
        element={
          <UserRoute>
            <HomePage />
          </UserRoute>
        }
      />

      {/* User Routes - accessible by both regular users and admins */}
      <Route
        path="/profile"
        element={
          <UserRoute>
            <ProfilePage />
          </UserRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <UserRoute>
            <UserDashboardPage />
          </UserRoute>
        }
      />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/exams/:examId" element={<ExamDetailPage />} />
      <Route
        path="/exams/:examId/results/:resultId"
        element={
          <UserRoute>
            <ExamResultsView />
          </UserRoute>
        }
      />

      <Route
        path="/exams/:examId/leaderboard"
        element={
          <UserRoute>
            <ExamLeaderboard />
          </UserRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <UserRoute>
            <UserPerformancePage />
          </UserRoute>
        }
      />
      <Route
        path="/performance/:userId"
        element={
          <UserRoute>
            <UserPerformancePage />
          </UserRoute>
        }
      />
      <Route
        path="/my-exams"
        element={
          <UserRoute>
            <MyExamsPage />
          </UserRoute>
        }
      />

      {/* Admin Routes - only accessible by admins */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <div>Admin Users Page - Coming Soon</div>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <AdminRoute>
            <AdminExamPanel />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exams/:examId/results/:resultId/evaluate"
        element={
          <AdminRoute>
            <ExamResponseEvaluator />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <div>Admin Reports Page - Coming Soon</div>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exam-statistics"
        element={
          <AdminRoute>
            <AdminExamStatisticsPage />
          </AdminRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/cors-error" element={<CorsWarning />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
