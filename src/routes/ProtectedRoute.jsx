import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/optimized-auth-context";

export function ProtectedRoute({
  children,
  requiredRole = null, // Accepts "admin", "user", or null (any authenticated user)
}) {
  const { isAuthenticated, isAdmin, checkingAuth, refreshAuth } = useAuth();
  const location = useLocation();
  const authRefreshAttempted = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, force a refresh of the auth state - but only once
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Only refresh if we haven't tried yet
        if (!authRefreshAttempted.current) {
          authRefreshAttempted.current = true;
          await refreshAuth();
        }
      } catch (err) {
        console.error("Auth refresh error in ProtectedRoute:", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [refreshAuth]);

  // If we're still checking auth status or loading, show a loading indicator
  if ((checkingAuth && !authRefreshAttempted.current) || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Handle role-based access
  if (requiredRole === "admin" && !isAdmin) {
    console.log(
      "Admin access required but user is not admin, redirecting to home"
    );
    // If admin access is required but user is not admin
    return <Navigate to="/home" replace />;
  }

  if (requiredRole === "user" && isAdmin) {
    console.log(
      "User access required but user is admin, redirecting to admin dashboard"
    );
    // If regular user access is required but user is admin
    // This is optional - you might want admins to access user pages
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render children if all conditions pass
  return children;
}
