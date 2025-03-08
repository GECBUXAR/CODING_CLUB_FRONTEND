import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, useAuth } from "./contexts/auth-context";

// Public Pages
import HomePage from "./pages/common/HomePage";
import AboutPage from "./pages/common/AboutPage";
import ContactPage from "./pages/common/ContactPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";

// User Pages
import ProfilePage from "./pages/user/ProfilePage";
import ExamsPage from "./pages/user/ExamsPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import MyExamsPage from "./pages/user/MyExamsPage.jsx";
import ExamDetailPage from "./pages/user/ExamDetailPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

// Error Pages
import NotFoundPage from "./pages/errors/NotFoundPage";
import CorsWarning from "./components/common/cors-warning";

// Protected Route Components
const UserRoute = ({ children }) => {
  return <RequireAuth allowedRoles={["user", "admin"]}>{children}</RequireAuth>;
};

const AdminRoute = ({ children }) => {
  return <RequireAuth allowedRoles={["admin"]}>{children}</RequireAuth>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />}
      />

      {/* User Routes */}
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
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/exams/:examId" element={<ExamDetailPage />} />
      <Route
        path="/my-exams"
        element={
          <UserRoute>
            <MyExamsPage />
          </UserRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
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
            <div>Admin Exams Page - Coming Soon</div>
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

      {/* Error Routes */}
      <Route path="/cors-error" element={<CorsWarning />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
