import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute({
  children,
  requiredRole = null, // Accepts "admin", "user", or null (any authenticated user)
}) {
  const { isAuthenticated, isAdmin, checkingAuth, refreshAuth } = useAuth();
  const location = useLocation();

  // On mount, force a refresh of the auth state
  useEffect(() => {
    // Only refresh if we think we're authenticated
    // This prevents infinite loading if a user is definitely not logged in
    if (isAuthenticated) {
      refreshAuth();
    }
  }, [isAuthenticated, refreshAuth]);

  // If we're still checking auth status, show a loading indicator
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle role-based access
  if (requiredRole === "admin" && !isAdmin) {
    // If admin access is required but user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === "user" && isAdmin) {
    // If regular user access is required but user is admin
    // This is optional - you might want admins to access user pages
    return <Navigate to="/admin" replace />;
  }

  // Render children if all conditions pass
  return children;
}
