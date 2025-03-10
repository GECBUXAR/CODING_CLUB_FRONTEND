import axios from "axios";
import { corsUrl, corsHeaders } from "./cors-helper";

// Determine if we need to use CORS proxy in development
const useProxy =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// Base URL for the API
const API_URL = "https://coding-club-backend-ten.vercel.app/api/v1";

// Create a standard instance for normal requests
const axiosInstance = axios.create({
  baseURL: corsUrl(API_URL, useProxy, true),
  withCredentials: true,
  headers: {
    ...corsHeaders(true),
  },
  timeout: 10000,
});

// Create a non-credentialed instance for auth requests
const axiosAuthInstance = axios.create({
  baseURL: corsUrl(API_URL, false, false), // Don't use proxy for auth requests
  withCredentials: true, // Still send credentials, but directly to the server not through proxy
  headers: {
    ...corsHeaders(false),
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Add the interceptor to both instances
axiosInstance.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);
axiosAuthInstance.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);

// Response interceptor for handling errors
const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

// Add the response interceptor to both instances
axiosInstance.interceptors.response.use(
  (response) => response,
  handleResponseError
);
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  handleResponseError
);

// For direct API calls that need to bypass CORS issues
export const API = {
  async get(url, config = {}) {
    // Use the appropriate instance based on the URL
    const instance =
      url.includes("/login") || url.includes("/signup") || url.includes("/auth")
        ? axiosAuthInstance
        : axiosInstance;
    return instance.get(url, config);
  },

  async post(url, data, config = {}) {
    // Use the appropriate instance based on the URL
    const instance =
      url.includes("/login") || url.includes("/signup") || url.includes("/auth")
        ? axiosAuthInstance
        : axiosInstance;
    return instance.post(url, data, config);
  },

  async put(url, data, config = {}) {
    return axiosInstance.put(url, data, config);
  },

  async delete(url, config = {}) {
    return axiosInstance.delete(url, config);
  },

  // Special methods for auth endpoints
  auth: {
    async login(credentials, config = {}) {
      return axiosAuthInstance.post("/users/login", credentials, config);
    },

    async signup(userData, config = {}) {
      return axiosAuthInstance.post("/users/signup", userData, config);
    },

    async checkAuth(config = {}) {
      return axiosInstance.get("/users/me", config);
    },
  },
};

export { axiosAuthInstance as authApi };
export default axiosInstance;
