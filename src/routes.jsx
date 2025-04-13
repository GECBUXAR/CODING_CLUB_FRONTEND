import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RedirectIfAuthenticated } from "./routes/RedirectIfAuthenticated";

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
);

// Public Pages - Lazy loaded
const LandingPage = lazy(() => import("./pages/common/LandingPage"));
const AboutPage = lazy(() => import("./pages/common/AboutPage"));
const ContactPage = lazy(() => import("./pages/common/ContactPage"));
const HomePage = lazy(() => import("./pages/common/HomePage"));

// Auth Pages - Lazy loaded
const LoginPage = lazy(() => import("./pages/auth/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage.jsx"));
const AdminSignupPage = lazy(() => import("./pages/auth/AdminSignupPage.jsx"));

// User Pages - Lazy loaded
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const ExamsPage = lazy(() => import("./pages/user/ExamsPage"));
const UserDashboardPage = lazy(() => import("./pages/user/UserDashboardPage"));
const MyExamsPage = lazy(() => import("./pages/user/MyExamsPage.jsx"));
const ExamDetailPage = lazy(() => import("./pages/user/ExamDetailPage"));
const UserPerformancePage = lazy(() =>
  import("./pages/user/UserPerformancePage")
);

// Exam Components - Lazy loaded
const ExamResultsView = lazy(() =>
  import("./components/exams/ExamResultsView")
);
const ExamLeaderboard = lazy(() =>
  import("./components/exams/ExamLeaderboard")
);

// Event Pages - Lazy loaded
const EventsPage = lazy(() => import("./pages/user/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/user/EventDetailPage"));

// Admin Pages - Lazy loaded
const AdminDashboardPage = lazy(() =>
  import("./pages/admin/AdminDashboardPage")
);
const AdminExamPanel = lazy(() =>
  import("./pages/admin/AdminExamPanel").then((module) => ({
    default: module.AdminExamPanel,
  }))
);
const AdminExamStatisticsPage = lazy(() =>
  import("./pages/admin/AdminExamStatisticsPage")
);
const ExamResponseEvaluator = lazy(() =>
  import("./components/admin/exam-response-evaluator")
);

// Error Pages - Lazy loaded
const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));

// Import ApiConnectionWarning with the updated name
import ApiConnectionWarning from "./components/common/cors-warning";

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
            <Suspense fallback={<LoadingFallback />}>
              <LandingPage />
            </Suspense>
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ContactPage />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Suspense fallback={<LoadingFallback />}>
              <LoginPage />
            </Suspense>
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/signup"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SignupPage />
          </Suspense>
        }
      />
      <Route
        path="/admin-signup"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminSignupPage />
          </Suspense>
        }
      />
      <Route
        path="/home"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          </UserRoute>
        }
      />

      {/* User Routes - accessible by both regular users and admins */}
      <Route
        path="/profile"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ProfilePage />
            </Suspense>
          </UserRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <UserDashboardPage />
            </Suspense>
          </UserRoute>
        }
      />
      <Route
        path="/events"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <EventsPage />
          </Suspense>
        }
      />
      <Route
        path="/events/:id"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <EventDetailPage />
          </Suspense>
        }
      />
      <Route
        path="/exams"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ExamsPage />
          </Suspense>
        }
      />
      <Route
        path="/exams/:examId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ExamDetailPage />
          </Suspense>
        }
      />
      <Route
        path="/exams/:examId/results/:resultId"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ExamResultsView />
            </Suspense>
          </UserRoute>
        }
      />

      <Route
        path="/exams/:examId/leaderboard"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ExamLeaderboard />
            </Suspense>
          </UserRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <UserPerformancePage />
            </Suspense>
          </UserRoute>
        }
      />
      <Route
        path="/performance/:userId"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <UserPerformancePage />
            </Suspense>
          </UserRoute>
        }
      />
      <Route
        path="/my-exams"
        element={
          <UserRoute>
            <Suspense fallback={<LoadingFallback />}>
              <MyExamsPage />
            </Suspense>
          </UserRoute>
        }
      />

      {/* Admin Routes - only accessible by admins */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboardPage />
            </Suspense>
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
            <Suspense fallback={<LoadingFallback />}>
              <AdminExamPanel />
            </Suspense>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/exams/:examId/results/:resultId/evaluate"
        element={
          <AdminRoute>
            <Suspense fallback={<LoadingFallback />}>
              <ExamResponseEvaluator />
            </Suspense>
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
            <Suspense fallback={<LoadingFallback />}>
              <AdminExamStatisticsPage />
            </Suspense>
          </AdminRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/cors-error" element={<ApiConnectionWarning />} />
      <Route
        path="*"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
