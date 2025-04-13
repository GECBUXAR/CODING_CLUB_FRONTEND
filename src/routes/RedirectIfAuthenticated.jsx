import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/optimized-auth-context";

/**
 * RedirectIfAuthenticated - A component that redirects users to /home if they are already authenticated
 * Used to protect routes that shouldn't be accessed by already logged-in users (like login page)
 */
export function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, checkingAuth, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(
    sessionStorage.getItem("redirectAuthChecked") === "true"
  );

  // On mount, check if the user is authenticated (verify access token)
  useEffect(() => {
    // Prevent multiple checks using sessionStorage instead of only component state
    if (sessionStorage.getItem("redirectAuthChecked") === "true") {
      setHasChecked(true);
      return;
    }

    const checkAuthentication = async () => {
      // If we already know the user is authenticated, redirect immediately
      if (isAuthenticated) {
        navigate("/home", { replace: true });
        return;
      }

      // Otherwise, try to refresh authentication status once
      const result = await refreshAuth();

      // Mark as checked in session storage to prevent repeated checks
      sessionStorage.setItem("redirectAuthChecked", "true");
      setHasChecked(true);

      // If authentication was successful, redirect to /home
      if (result) {
        navigate("/home", { replace: true });
      }
    };

    checkAuthentication();

    // Cleanup function to reset the check flag when component unmounts
    return () => {
      // Don't reset the flag on unmount to prevent infinite loops
      // We'll let it persist in the session
    };
  }, [isAuthenticated, navigate, refreshAuth]);

  // While checking authentication, show loading indicator
  if (checkingAuth && !hasChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // If user is authenticated, don't render children (even though we'll redirect)
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If user is not authenticated, render the children (login page, landing page, etc.)
  return children;
}
