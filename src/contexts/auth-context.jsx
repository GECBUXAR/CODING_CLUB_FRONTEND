import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

// Create auth context with null as default value
const AuthContext = createContext(null);

// Initial state for the reducer
const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  token: localStorage.getItem("token") || null,
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
        token: action.payload.token,
        error: null,
        loading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        token: null,
        error: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        token: null,
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

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (state.token) {
          const result = await authService.getCurrentUser();
          if (result.success) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: result.data,
                token: state.token,
                isAdmin: result.data.role === "admin",
              },
            });
          }
        }
      } catch (error) {
        console.log("No active session found", error);
      } finally {
        setCheckingAuth(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, [state.token]);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // For development testing - you can use test accounts
      // Set to false to always use the real API
      const useTestAccounts = false;

      if (useTestAccounts) {
        const testUsers = {
          "user@test.com": {
            password: "password123",
            user: {
              id: "1",
              name: "Test User",
              email: "user@test.com",
              role: "user",
              createdAt: new Date().toISOString(),
            },
            token: "test-user-token",
          },
          "admin@test.com": {
            password: "admin123",
            user: {
              id: "2",
              name: "Test Admin",
              email: "admin@test.com",
              role: "admin",
              createdAt: new Date().toISOString(),
            },
            token: "test-admin-token",
          },
          "faculty@test.com": {
            password: "faculty123",
            user: {
              id: "3",
              name: "Test Faculty",
              email: "faculty@test.com",
              role: "faculty",
              createdAt: new Date().toISOString(),
            },
            token: "test-faculty-token",
          },
        };

        // Check if the user exists and password matches
        const testUser = testUsers[email];
        if (testUser && testUser.password === password) {
          const token = testUser.token;
          localStorage.setItem("token", token);

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: testUser.user,
              token: token,
              isAdmin: testUser.user.role === "admin",
            },
          });

          return {
            success: true,
            isAdmin: testUser.user.role === "admin",
          };
        }
      }

      // Always call the real auth service
      console.log("Calling authService.login with:", { email, password });
      const result = await authService.login({ email, password });
      console.log("Auth service result:", result);

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.data.user,
            token: result.data.token,
            isAdmin: result.data.data.user.role === "admin",
          },
        });
        return {
          success: true,
          isAdmin: result.data.data.user.role === "admin",
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
        localStorage.setItem("token", result.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.data.user,
            token: result.data.token,
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
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await authService.register(userData);

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: result.data.data.user,
            token: result.data.token,
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
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const result = await authService.logout();
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      return result;
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Logout failed" };
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
        // In a real token-based system, you'd update the token here
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
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    user: state.user,
    token: state.token,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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

  // Check if user has the required role
  const userRole = isAdmin ? "admin" : "user";
  if (!allowedRoles.includes(userRole)) {
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
