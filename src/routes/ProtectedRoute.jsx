import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/optimized-auth-context";

export function ProtectedRoute({
  children,
  requiredRole = null, // Accepts "admin", "user", or null (any authenticated user)
}) {
  const { isAuthenticated, isAdmin, checkingAuth, refreshAuth } = useAuth();
  const location = useLocation();
  const authRefreshAttempted = useRef(false);

  // On mount, force a refresh of the auth state - but only once
  useEffect(() => {
    // Only refresh if we think we're authenticated and haven't tried yet
    if (isAuthenticated && !authRefreshAttempted.current) {
      authRefreshAttempted.current = true;
      refreshAuth().catch((err) => {
        console.error("Auth refresh error in ProtectedRoute:", err);
      });
    }
  }, [isAuthenticated, refreshAuth]);

  // If we're still checking auth status, show a loading indicator
  if (checkingAuth && !authRefreshAttempted.current) {
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
    return <Navigate to="/home" replace />;
  }

  if (requiredRole === "user" && isAdmin) {
    // If regular user access is required but user is admin
    // This is optional - you might want admins to access user pages
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render children if all conditions pass
  return children;
}
