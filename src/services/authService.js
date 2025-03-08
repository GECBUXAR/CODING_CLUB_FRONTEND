import apiClient from "./api";

// User login
export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/users/login", credentials);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

// Admin login
export const adminLogin = async (credentials) => {
  try {
    const response = await apiClient.post("/admin/login", credentials);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Admin login failed",
    };
  }
};

// User registration
export const register = async (userData) => {
  try {
    const response = await apiClient.post("/users/signup", userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Registration failed",
    };
  }
};

// Logout user
export const logout = async () => {
  try {
    await apiClient.post("/users/logout");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Logout failed",
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
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get user profile",
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
    return {
      success: false,
      error: error.response?.data?.message || "Profile update failed",
    };
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    await apiClient.put("/users/change-password", passwordData);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Password change failed",
    };
  }
};
