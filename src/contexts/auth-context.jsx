import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance, { API } from "@/lib/axios";
import {
  loginWithBridge,
  signupWithBridge,
  checkAuthWithBridge,
} from "@/lib/cors-bridge";
import { NotificationContext } from "@/contexts/notification-context";

// Create the auth context with initial default values
export const AuthContext = createContext({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isAdmin: false,
  register: async () => ({ success: false }),
  login: async () => ({ success: false }),
  logout: () => {},
  updateProfile: async () => ({ success: false }),
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get notification context safely
  const notification = useContext(NotificationContext);
  const showError = (message) => {
    if (notification?.error) {
      notification.error(message);
    } else {
      console.error(message);
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem("authToken");

        if (token) {
          // Fetch user data - first try normal API
          try {
            const response = await API.auth.checkAuth();
            setUser(response.data);
          } catch (apiError) {
            console.warn(
              "Regular API auth check failed, trying bridge:",
              apiError
            );

            // Try CORS bridge as fallback
            const bridgeResult = await checkAuthWithBridge();
            if (bridgeResult.success && bridgeResult.user) {
              setUser(bridgeResult.user);
            } else {
              throw new Error(bridgeResult.error || "Authentication failed");
            }
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        // Clear any invalid tokens
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // First try regular API
      try {
        const response = await API.auth.signup(userData);

        // Save token
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);

        // Set user in state
        setUser(user);
        return { success: true };
      } catch (apiError) {
        console.warn("Regular API signup failed, trying bridge:", apiError);

        // Try CORS bridge as fallback
        const bridgeResult = await signupWithBridge(userData);
        if (bridgeResult.success) {
          // Token is already saved by the bridge
          setUser(bridgeResult.user);
          return { success: true };
        }

        throw new Error(bridgeResult.error || "Registration failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // First try regular API
      try {
        const response = await API.auth.login(credentials);

        // Save token
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);

        // Set user in state
        setUser(user);
        return { success: true };
      } catch (apiError) {
        console.warn("Regular API login failed, trying bridge:", apiError);

        // Try CORS bridge as fallback
        const bridgeResult = await loginWithBridge(credentials);
        if (bridgeResult.success) {
          // Token is already saved by the bridge
          setUser(bridgeResult.user);
          return { success: true };
        }

        throw new Error(bridgeResult.error || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token
    localStorage.removeItem("authToken");

    // Clear user state
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.put("/users/profile", userData);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided through context
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
