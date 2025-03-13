import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import apiClient from "../services/api";

// Create auth context with null as default value
const AuthContext = createContext(null);

// Initial state for the reducer
const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  error: null,
  loading: false,
};

// Reducer function to handle auth actions
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin,
        user: action.payload.user,
        error: null,
        loading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        error: null,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Listen for auth errors from API client
  useEffect(() => {
    const handleAuthError = (event) => {
      console.log("Auth error event received", event.detail);
      // Only redirect if we think we're authenticated but get a 401/403
      if (state.isAuthenticated) {
        dispatch({ type: "LOGOUT" });
        navigate("/login", {
          state: {
            from: window.location.pathname,
            message: "Your session has expired. Please log in again.",
          },
        });
      }
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => {
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, [navigate, state.isAuthenticated]);

  // Function to check authentication status explicitly
  const refreshAuth = async () => {
    // Prevent excessive calls to refreshAuth
    const now = Date.now();
    const lastRefreshTime = window.sessionStorage.getItem("lastAuthRefresh");
    const refreshInterval = 5000; // 5 seconds minimum between refreshes

    if (
      lastRefreshTime &&
      now - Number.parseInt(lastRefreshTime, 10) < refreshInterval
    ) {
      console.log("Skipping auth refresh - too recent");
      return state.isAuthenticated; // Return current authentication state
    }

    window.sessionStorage.setItem("lastAuthRefresh", now.toString());
    setCheckingAuth(true);

    try {
      console.log("Explicitly refreshing authentication status...");

      // Try to get the user profile first
      let result = await authService.getCurrentUser();

      // If the user profile fails, try admin profile
      if (!result.success) {
        try {
          // If user profile didn't work, try the admin profile endpoint
          const adminResult = await apiClient.get("/admin/profile");
          if (adminResult.data && adminResult.data.status === "success") {
            result = {
              success: true,
              data: adminResult.data.data,
            };
            // Ensure admin role is set
            if (result.data && !result.data.role) {
              result.data.role = "admin";
            }
          }
        } catch (adminError) {
          console.error("Admin profile check failed:", adminError);
        }
      }

      if (result.success && result.data) {
        console.log("Refresh confirmed user is authenticated:", result.data);

        // Determine if user is admin based on role property
        const isAdmin = result.data.role === "admin";

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data,
            isAdmin,
          },
        });
        return true;
      }

      console.log("Refresh found no active session");
      dispatch({ type: "LOGOUT" });
      return false;
    } catch (error) {
      console.error("Error refreshing authentication:", error);
      dispatch({ type: "LOGOUT" });
      return false;
    } finally {
      setCheckingAuth(false);
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    // Use a ref to prevent multiple auth checks
    const hasAttemptedInitialAuth = sessionStorage.getItem(
      "hasAttemptedInitialAuth"
    );

    const checkAuth = async () => {
      if (hasAttemptedInitialAuth) {
        console.log("Skipping initial auth check - already attempted");
        setCheckingAuth(false);
        setInitialized(true);
        return;
      }

      try {
        sessionStorage.setItem("hasAttemptedInitialAuth", "true");
        setCheckingAuth(true);
        console.log("Checking authentication status...");

        // Try to get the user profile first
        let result = await authService.getCurrentUser();

        // If the user profile fails, try admin profile
        if (!result.success) {
          try {
            // If user profile didn't work, try the admin profile endpoint
            const adminResult = await apiClient.get("/admin/profile");
            if (adminResult.data && adminResult.data.status === "success") {
              result = {
                success: true,
                data: adminResult.data.data,
              };
              // Ensure admin role is set
              if (result.data && !result.data.role) {
                result.data.role = "admin";
              }
            }
          } catch (adminError) {
            console.error("Admin profile check failed:", adminError);
          }
        }

        if (result.success && result.data) {
          console.log("User is authenticated:", result.data);

          // Determine if user is admin based on role property
          const isAdmin = result.data.role === "admin";

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: result.data,
              isAdmin,
            },
          });
        } else {
          console.log("No active session found");
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        setCheckingAuth(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      console.log("Calling authService.login with:", { email, password });
      const result = await authService.login({ email, password });
      console.log("Auth service result:", result);

      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.user,
            isAdmin: result.data.user.role === "admin",
          },
        });
        return {
          success: true,
          isAdmin: result.data.user.role === "admin",
        };
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: result.error,
      });
      return { success: false, error: result.error };
    } catch (error) {
      console.error("Login error:", error);

      // Check if this is a CORS or network error
      if (error.isCorsError) {
        // Dispatch CORS error event
        window.dispatchEvent(new CustomEvent("cors-error"));
        console.error("CORS error detected:", error);
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Login failed",
      });
      return { success: false, error: error.message || "Login failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Admin login function
  const adminLogin = async (email, password, secretKey) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.adminLogin({
        email,
        password,
        secretKey,
      });

      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.user,
            isAdmin: true,
          },
        });
        return { success: true };
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: result.error,
      });
      return { success: false, error: result.error };
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Admin login failed",
      });
      return { success: false, error: error.message || "Admin login failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.register(userData);

      if (result.success) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.user,
            isAdmin: false,
          },
        });
        return { success: true };
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: result.error,
      });
      return { success: false, error: result.error };
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Registration failed",
      });
      return { success: false, error: error.message || "Registration failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const result = await authService.logout();
      dispatch({ type: "LOGOUT" });
      return result;
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we should still log out the user locally
      dispatch({ type: "LOGOUT" });
      return { success: true };
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.updateProfile(userData);

      if (result.success) {
        dispatch({
          type: "UPDATE_USER",
          payload: result.data,
        });
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: error.message || "Update failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.changePassword(passwordData);

      if (result.success) {
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error: error.message || "Password change failed",
      };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Values to be provided to consumers
  const value = {
    state,
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    user: state.user,
    error: state.error,
    loading: state.loading,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkingAuth,
    initialized,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Initialize state if it's undefined to prevent errors in components
  if (!context.state) {
    console.warn("Auth state is undefined, initializing with defaults");
    context.state = { ...initialState };
  }

  return context;
}

// RequireAuth component for protected routes
export function RequireAuth({ children, allowedRoles = ["user", "admin"] }) {
  const { isAuthenticated, isAdmin, initialized, checkingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && initialized) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (!allowedRoles.includes(isAdmin ? "admin" : "user")) {
        navigate("/unauthorized");
      }
    }
  }, [
    checkingAuth,
    initialized,
    isAuthenticated,
    isAdmin,
    allowedRoles,
    navigate,
  ]);

  if (checkingAuth || !initialized) {
    // Return a loading spinner
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

// Role-based rendering
export function RoleBasedRender({ children, roles = ["user", "admin"] }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const userRole = isAdmin ? "admin" : "user";
  if (!roles.includes(userRole)) {
    return null;
  }

  return children;
}
