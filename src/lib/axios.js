/**
 * Re-export the standard API client from services/api
 * This ensures consistency across the application
 */

import apiClient, { withTimeout } from "../services/api";

// For backward compatibility, we maintain the same API
export const API = {
  async get(url, config = {}) {
    return apiClient.get(url, config);
  },

  async post(url, data, config = {}) {
    return apiClient.post(url, data, config);
  },

  async put(url, data, config = {}) {
    return apiClient.put(url, data, config);
  },

  async delete(url, config = {}) {
    return apiClient.delete(url, config);
  },

  // Special methods for auth endpoints
  auth: {
    async login(credentials, config = {}) {
      return apiClient.post("/users/login", credentials, config);
    },

    async signup(userData, config = {}) {
      return apiClient.post("/users/signup", userData, config);
    },

    async checkAuth(config = {}) {
      return apiClient.get("/users/me", config);
    },
  },
};

// Export both the API object and the axios instance
export { withTimeout };
export default apiClient;
