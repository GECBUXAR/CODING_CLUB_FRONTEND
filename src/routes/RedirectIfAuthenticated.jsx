import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/optimized-auth-context";

/**
 * RedirectIfAuthenticated - A component that redirects users to /home if they are already authenticated
 * Used to protect routes that shouldn't be accessed by already logged-in users (like login page)
 */
export function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, checkingAuth, refreshAuth } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);
  const authCheckRef = useRef(false);

  // On mount, check if the user is authenticated (verify access token)
  useEffect(() => {
    // Prevent multiple checks
    if (authCheckRef.current) {
      return;
    }

    // Mark that we've started the check
    authCheckRef.current = true;

    const checkAuthentication = async () => {
      try {
        // Only refresh auth if we're not already authenticated
        if (!isAuthenticated) {
          await refreshAuth();
        }
      } catch (error) {
        console.error("Auth refresh error:", error);
      } finally {
        // Always mark as checked when done
        setHasChecked(true);
      }
    };

    // Start the auth check
    checkAuthentication();
  }, [isAuthenticated, refreshAuth]);

  // While checking authentication, show loading indicator
  if (checkingAuth && !hasChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If user is not authenticated, render the children (login page, landing page, etc.)
  return children;
}
