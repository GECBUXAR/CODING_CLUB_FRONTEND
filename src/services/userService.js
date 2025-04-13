import enhancedApiClient from "./enhancedApi";

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await enhancedApiClient.get("/admin/users");
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch users",
    };
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    const response = await enhancedApiClient.get(`/admin/users/${userId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch user details",
    };
  }
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    const response = await enhancedApiClient.put(
      `/admin/users/${userId}`,
      userData
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update user",
    };
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    await enhancedApiClient.delete(`/admin/users/${userId}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete user",
    };
  }
};

// Get user activity (admin only)
export const getUserActivity = async (userId) => {
  try {
    const response = await enhancedApiClient.get(
      `/admin/users/${userId}/activity`
    );
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch user activity",
    };
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await enhancedApiClient.post("/users/subscribe", {
      email,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to subscribe",
    };
  }
};
