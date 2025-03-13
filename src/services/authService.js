import apiClient from "./api";

// User login
export const login = async (credentials) => {
  console.log("authService.login called with:", credentials);
  try {
    const response = await apiClient.post("/users/login", credentials);
    console.log("Login response:", response.data);

    const userData = response.data.user || response.data.data?.user;

    // Ensure the role information is consistent
    if (userData && !userData.role) {
      userData.role = "user"; // Default role
    }

    return {
      success: true,
      data: {
        user: userData,
      },
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

    const userData = response.data.user || response.data.data?.user;

    // Ensure the user has admin role
    if (userData && (!userData.role || userData.role !== "admin")) {
      userData.role = "admin";
    }

    return {
      success: true,
      data: {
        user: userData,
      },
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
    // Determine if this is an admin registration
    const isAdminRegistration = userData.role === "admin" && userData.secretKey;
    const endpoint = isAdminRegistration ? "/admin/signup" : "/users/signup";

    // Set a shorter timeout for this specific request
    const response = await apiClient.post(endpoint, userData, {
      timeout: 8000, // 8 seconds timeout for registration
    });
    console.log("Register response:", response.data);
    return {
      success: true,
      data: {
        user: response.data.user || response.data.data?.user,
      },
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

// User logout
export const logout = async () => {
  try {
    const response = await apiClient.post("/users/logout");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Logout error in authService:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Logout failed",
    };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user profile");
    const response = await apiClient.get("/users/profile");
    console.log("Current user response:", response.data);

    // Check for data in the response using both formats
    // 1. Check for the new format: { statusCode, data, message, success }
    if (response.data.success && response.data.data) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    // 2. Check for the old format: { status: "success", data }
    if (
      response.data.status === "success" &&
      (response.data.data || response.data.user)
    ) {
      return {
        success: true,
        data: response.data.data || response.data.user,
      };
    }

    // If we don't have user data despite a successful response
    console.warn("No user data found in successful response");
    return {
      success: false,
      error: "No user data found in response",
    };
  } catch (error) {
    console.error("Get user profile error in authService:", error);

    // If it's an authentication error, don't treat it as a failure
    // Just return success: false to indicate the user isn't logged in
    if (
      error.status === 401 ||
      error.status === 403 ||
      error.message?.includes("Authentication required")
    ) {
      return {
        success: false,
        authenticated: false,
        error: "Not authenticated",
      };
    }

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
      data: response.data.data || response.data.user,
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
    const response = await apiClient.post(
      "/users/change-password",
      passwordData
    );
    return {
      success: true,
      data: response.data,
    };
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
