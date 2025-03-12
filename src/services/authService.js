import apiClient from "./api";

// User login
export const login = async (credentials) => {
  console.log("authService.login called with:", credentials);
  try {
    const response = await apiClient.post("/users/login", credentials);
    console.log("Login response:", response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Login error in authService:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

// Admin login
export const adminLogin = async (credentials) => {
  console.log("authService.adminLogin called with:", credentials);
  try {
    const response = await apiClient.post("/admin/login", credentials);
    console.log("Admin login response:", response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Admin login error in authService:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Admin login failed",
    };
  }
};

// User registration
export const register = async (userData) => {
  console.log("authService.register called with:", userData);
  try {
    // Set a shorter timeout for this specific request
    const response = await apiClient.post("/users/signup", userData, {
      timeout: 8000, // 8 seconds timeout for registration
    });
    console.log("Register response:", response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Registration error in authService:", error);
    // Check for timeout error
    if (error?.message?.includes("timeout")) {
      return {
        success: false,
        error:
          "Connection timed out. The server might be down or your internet connection is unstable.",
      };
    }
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};

// Logout user
export const logout = async () => {
  try {
    // Add a timeout to the logout request
    await apiClient.post("/users/logout", {}, { timeout: 5000 });
    return { success: true };
  } catch (error) {
    console.error("Logout error in authService:", error);

    // If it's a network error or timeout, still consider logout successful
    // This ensures users can log out even if the server is unreachable
    if (
      error.message?.includes("Network Error") ||
      error.message?.includes("timeout") ||
      !error.response
    ) {
      console.log(
        "Network error during logout, but proceeding with client-side logout"
      );
      return { success: true };
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || "Logout failed",
    };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/users/profile");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get user profile error in authService:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to get user profile",
    };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put("/users/update-profile", userData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Update profile error in authService:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Profile update failed",
    };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    await apiClient.put("/users/change-password", passwordData);
    return { success: true };
  } catch (error) {
    console.error("Change password error in authService:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Password change failed",
    };
  }
};
