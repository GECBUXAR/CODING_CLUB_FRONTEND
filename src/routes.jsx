import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "./contexts/auth-context";

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
import EventsPage from "./pages/user/EventsPage";
import UserDashboardPage from "./pages/user/UserDashboardPage";
import MyExamsPage from "./pages/user/MyExamsPage.jsx";
import ExamDetailPage from "./pages/user/ExamDetailPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { AdminExamPanel } from "./pages/admin/AdminExamPanel";

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
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
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
      <Route path="/events" element={<EventsPage />} />
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
