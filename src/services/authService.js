import enhancedApiClient from "./enhancedApi";

// Check if email belongs to an admin user
export const checkIfAdmin = async (email) => {
  try {
    const response = await enhancedApiClient.get(
      `/admin/check-by-email?email=${encodeURIComponent(email)}`
    );
    return response.data?.isAdmin || false;
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
};

// User login
export const login = async (credentials) => {
  console.log("authService.login called with:", credentials);
  try {
    // First check if this email belongs to an admin
    const isAdmin = await checkIfAdmin(credentials.email);

    // If it's an admin login, use the adminLogin function
    if (isAdmin) {
      // Add the secretKey to credentials for admin login
      const adminCredentials = {
        ...credentials,
        secretKey: import.meta.env.VITE_ADMIN_SECRET_KEY || "admin-secret-key",
      };
      return await adminLogin(adminCredentials);
    }

    // Regular user login
    const response = await enhancedApiClient.post("/users/login", credentials);
    console.log("Login response:", response.data);

    const userData = response.data.user || response.data.data?.user;
    const accessToken =
      response.data.accessToken || response.data.data?.accessToken;

    // Store the token in localStorage
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log("Access token stored in localStorage");
    }

    // Ensure the role information is consistent
    if (userData) {
      userData.role = userData.role || "user";
    }

    return {
      success: true,
      data: {
        user: userData,
        accessToken,
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
    const response = await enhancedApiClient.post("/admin/login", credentials);
    console.log("Admin login response:", response.data);

    const userData = response.data.user || response.data.data?.user;
    const accessToken =
      response.data.accessToken || response.data.data?.accessToken;

    // Store the token in localStorage
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log("Admin access token stored in localStorage");
    }

    // Ensure the user has admin role
    if (userData && (!userData.role || userData.role !== "admin")) {
      userData.role = "admin";
    }

    return {
      success: true,
      data: {
        user: userData,
        accessToken,
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
    const response = await enhancedApiClient.post(endpoint, userData, {
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

// User logout - works for both regular users and admins
export const logout = async () => {
  try {
    // Check if the current user is an admin by trying to access the admin profile
    let isAdmin = false;
    try {
      const adminCheck = await enhancedApiClient.get("/admin/profile");
      isAdmin =
        adminCheck.data &&
        (adminCheck.data.status === "success" || adminCheck.data.success);
    } catch (adminError) {
      // Not an admin, continue with regular user logout
      console.log("Not logged in as admin, using regular logout", adminError);
    }

    // Use the appropriate endpoint based on user type
    const endpoint = isAdmin ? "/admin/logout" : "/users/logout";
    const response = await enhancedApiClient.post(endpoint);

    // Clear the token from localStorage
    localStorage.removeItem("accessToken");
    console.log("Access token removed from localStorage");

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

// Get current user profile - works for both regular users and admins
export const getCurrentUser = async () => {
  try {
    console.log("Fetching current user profile");

    // First try the regular user profile endpoint
    try {
      const response = await enhancedApiClient.get("/users/profile");
      console.log("Current user response:", response.data);

      // Check for data in the response using both formats
      // 1. Check for the new format: { statusCode, data, message, success }
      if (response.data.success && response.data.data) {
        // Ensure role is set to user if not specified
        const userData = response.data.data;
        if (userData && !userData.role) {
          userData.role = "user";
        }
        return {
          success: true,
          data: userData,
        };
      }

      // 2. Check for the old format: { status: "success", data }
      if (
        response.data.status === "success" &&
        (response.data.data || response.data.user)
      ) {
        const userData = response.data.data || response.data.user;
        // Ensure role is set to user if not specified
        if (userData && !userData.role) {
          userData.role = "user";
        }
        return {
          success: true,
          data: userData,
        };
      }
    } catch (userError) {
      // If user profile fails, try admin profile
      console.log("User profile check failed, trying admin profile", userError);
    }

    // If we get here, try the admin profile endpoint
    try {
      const adminResponse = await enhancedApiClient.get("/admin/profile");
      console.log("Admin profile response:", adminResponse.data);

      if (
        adminResponse.data &&
        (adminResponse.data.status === "success" || adminResponse.data.success)
      ) {
        const adminData = adminResponse.data.data || adminResponse.data;
        // Ensure admin role is set
        if (adminData && !adminData.role) {
          adminData.role = "admin";
        }
        return {
          success: true,
          data: adminData,
        };
      }
    } catch (adminError) {
      console.error("Admin profile check failed:", adminError);
    }

    // If we get here, neither user nor admin profile worked
    console.warn("No user data found in any response");
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
    const response = await enhancedApiClient.put(
      "/users/update-profile",
      userData
    );
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
    const response = await enhancedApiClient.post(
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
