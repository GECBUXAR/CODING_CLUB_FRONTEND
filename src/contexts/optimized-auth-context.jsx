import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import apiClient from "../services/api";
import { createOptimizedContext } from "./optimized-context";

// Initial state for the reducer
const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  error: null,
  loading: false,
  checkingAuth: true,
  initialized: false,
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
    case "SET_CHECKING_AUTH":
      return {
        ...state,
        checkingAuth: action.payload,
      };
    case "SET_INITIALIZED":
      return {
        ...state,
        initialized: action.payload,
      };
    default:
      return state;
  }
}

// Define action creators
const actions = {
  // Login action
  login: (email, password) => async (dispatch) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.login({ email, password });

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
      // Check if this is a CORS or network error
      if (error.isCorsError) {
        // Dispatch CORS error event
        window.dispatchEvent(new CustomEvent("cors-error"));
      }

      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.message || "Login failed",
      });
      return { success: false, error: error.message || "Login failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  // Admin login action
  adminLogin: (email, password, secretKey) => async (dispatch) => {
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
  },

  // Register action
  register: (userData) => async (dispatch) => {
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
  },

  // Logout action
  logout: () => async (dispatch) => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
      return { success: true };
    } catch (error) {
      // Even if the API call fails, we should still log out the user locally
      dispatch({ type: "LOGOUT" });
      return { success: true };
    }
  },

  // Update profile action
  updateProfile: (userData) => async (dispatch) => {
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
      return { success: false, error: error.message || "Update failed" };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  // Change password action
  changePassword: (passwordData) => async (dispatch) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.changePassword(passwordData);
      return { success: result.success, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Password change failed",
      };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },

  // Clear error action
  clearError: () => ({ type: "CLEAR_ERROR" }),

  // Set checking auth state
  setCheckingAuth: (isChecking) => ({
    type: "SET_CHECKING_AUTH",
    payload: isChecking,
  }),

  // Set initialized state
  setInitialized: (isInitialized) => ({
    type: "SET_INITIALIZED",
    payload: isInitialized,
  }),

  // Refresh auth action
  refreshAuth: () => async (dispatch, getState) => {
    const state = getState();
    
    // Prevent excessive calls to refreshAuth
    const now = Date.now();
    const lastRefreshTime = window.sessionStorage.getItem("lastAuthRefresh");
    const refreshInterval = 5000; // 5 seconds minimum between refreshes

    if (
      lastRefreshTime &&
      now - Number.parseInt(lastRefreshTime, 10) < refreshInterval
    ) {
      return state.isAuthenticated; // Return current authentication state
    }

    window.sessionStorage.setItem("lastAuthRefresh", now.toString());
    dispatch({ type: "SET_CHECKING_AUTH", payload: true });

    try {
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

      dispatch({ type: "LOGOUT" });
      return false;
    } catch (error) {
      dispatch({ type: "LOGOUT" });
      return false;
    } finally {
      dispatch({ type: "SET_CHECKING_AUTH", payload: false });
    }
  },
};

// Create the optimized context
const {
  Provider: OptimizedAuthProvider,
  useStateContext: useAuthState,
  useActions: useAuthActions,
} = createOptimizedContext({
  initialState,
  reducer: authReducer,
  actions,
});

// Create a wrapper component to handle initialization and auth checking
export function AuthProvider({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Create the enhanced provider component
  const EnhancedProvider = ({ children }) => {
    const { isAuthenticated } = useAuthState();
    const { refreshAuth, setCheckingAuth, setInitialized } = useAuthActions();

    // Listen for auth errors from API client
    useEffect(() => {
      const handleAuthError = (event) => {
        // Only redirect if we think we're authenticated but get a 401/403
        if (isAuthenticated) {
          // Use the logout action
          const { logout } = useAuthActions();
          logout();
          
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
    }, [navigate, isAuthenticated]);

    // Check if user is already logged in on initial load
    useEffect(() => {
      // Use a ref to prevent multiple auth checks
      const hasAttemptedInitialAuth = sessionStorage.getItem(
        "hasAttemptedInitialAuth"
      );

      const checkAuth = async () => {
        if (hasAttemptedInitialAuth) {
          setCheckingAuth(false);
          setInitialized(true);
          return;
        }

        try {
          sessionStorage.setItem("hasAttemptedInitialAuth", "true");
          setCheckingAuth(true);
          
          // Use the refreshAuth action to check authentication
          await refreshAuth();
        } finally {
          setCheckingAuth(false);
          setInitialized(true);
        }
      };

      checkAuth();
    }, []);

    return children;
  };

  // Memoize the provider to prevent unnecessary re-renders
  const MemoizedProvider = useMemo(() => {
    return (
      <OptimizedAuthProvider>
        <EnhancedProvider>{children}</EnhancedProvider>
      </OptimizedAuthProvider>
    );
  }, [children]);

  return MemoizedProvider;
}

// Custom hook to use auth context with all state and actions combined
export function useAuth() {
  const state = useAuthState();
  const actions = useAuthActions();

  // Combine state and actions for backward compatibility
  return { ...state, ...actions };
}

// RequireAuth component for protected routes
export function RequireAuth({ children, allowedRoles = ["user", "admin"] }) {
  const { isAuthenticated, isAdmin, initialized, checkingAuth } = useAuthState();
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
  const { isAuthenticated, isAdmin } = useAuthState();

  if (!isAuthenticated) {
    return null;
  }

  const userRole = isAdmin ? "admin" : "user";
  if (!roles.includes(userRole)) {
    return null;
  }

  return children;
}
