import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/admin/dashboard-layout";
import DashboardOverview from "@/components/admin/dashboard-overview";
import { EventsPage } from "@/components/admin/events-page";
import { FacultyPage } from "@/components/admin/faculty-page";
import { SettingsPage } from "@/components/admin/settings-page";
import { AdminExamPanel } from "./AdminExamPanel";
import { useAuth } from "@/contexts/optimized-auth-context";

/**
 * Admin Dashboard Page - Main container for all admin pages
 * Handles navigation between different admin sections and authentication
 */

export default function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated and is an admin
  useEffect(() => {
    const checkAuth = async () => {
      // Make sure authState is loaded
      if (!authState) return;

      console.log("AdminDashboardPage - Checking auth state:", {
        isAuthenticated: authState.isAuthenticated,
        userRole: authState?.user?.role,
      });

      if (!authState.isAuthenticated) {
        // Redirect to login if not authenticated
        console.log(
          "AdminDashboardPage - User not authenticated, redirecting to login"
        );
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "Please log in to access the admin dashboard",
          },
        });
      } else if (authState?.user?.role !== "admin") {
        // Redirect to home if not an admin
        console.log("AdminDashboardPage - User not admin, redirecting to home");
        navigate("/", {
          state: {
            message: "You don't have permission to access the admin dashboard",
          },
        });
      } else {
        console.log(
          "AdminDashboardPage - User is authenticated admin, proceeding"
        );
      }
    };

    checkAuth();
  }, [authState, navigate, location]);

  // Parse the current page from URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      ["dashboard", "events", "admin-exams", "faculty", "settings"].includes(
        hash
      )
    ) {
      setCurrentPage(hash);
    }
  }, []);

  // Update URL hash when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Show loading state while checking authentication
  if (!authState || authState.loading) {
    console.log("AdminDashboardPage - Loading state", { authState });
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-primary">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      setCurrentPage={handlePageChange}
    >
      {currentPage === "dashboard" && <DashboardOverview />}
      {currentPage === "events" && <EventsPage />}
      {currentPage === "admin-exams" && <AdminExamPanel />}
      {currentPage === "faculty" && <FacultyPage />}
      {currentPage === "settings" && <SettingsPage />}
    </DashboardLayout>
  );
}
