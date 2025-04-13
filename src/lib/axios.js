/**
 * Re-export the standard API client from services/api
 * This ensures consistency across the application
 */

import apiClient, { withTimeout } from "../services/api";
import enhancedApiClient from "../services/enhancedApi";

// For backward compatibility, we maintain the same API but use enhanced client
export const API = {
  async get(url, config = {}) {
    return enhancedApiClient.get(url, config, true);
  },

  async post(url, data, config = {}) {
    return enhancedApiClient.post(url, data, config);
  },

  async put(url, data, config = {}) {
    return enhancedApiClient.put(url, data, config);
  },

  async delete(url, config = {}) {
    return enhancedApiClient.delete(url, config);
  },

  // Special methods for auth endpoints
  auth: {
    async login(credentials, config = {}) {
      return enhancedApiClient.post("/users/login", credentials, config);
    },

    async signup(userData, config = {}) {
      return enhancedApiClient.post("/users/signup", userData, config);
    },

    async checkAuth(config = {}) {
      return enhancedApiClient.get("/users/me", config, true);
    },
  },
};

// Export both the API object and the axios instance
export { withTimeout };
// For backward compatibility, we export enhancedApiClient as default
export default enhancedApiClient;
