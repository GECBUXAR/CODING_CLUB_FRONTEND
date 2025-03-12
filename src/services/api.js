import axios from "axios";
import { API_CONFIG, AUTH_CONFIG } from "../config";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Important for cookies
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log("Request data:", config.data);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response (${response.status}):`, response.data);
    }
    return response;
  },
  async (error) => {
    // Create a custom error object for consistent error handling
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.message || "Something went wrong",
      data: error.response?.data,
      originalError: error,
    };

    // Log CORS errors for debugging
    if (
      error.message?.includes("Network Error") ||
      error.message?.includes("CORS")
    ) {
      console.error("CORS or Network Error:", error);
      customError.isCorsError = true;
      customError.message =
        "Network connectivity issue. Please try again later.";
    }

    // Handle 401 unauthorized errors (token expired)
    if (error.response?.status === 401) {
      // Clear any stored tokens
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);

      // You could implement auto-redirect here if needed
      // window.location.href = '/login';
    }

    return Promise.reject(customError);
  }
);

// Helper to add timeout to requests
export const withTimeout = (promise, ms = API_CONFIG.TIMEOUT) => {
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
};

// Export both named and default for flexibility
export { apiClient };
export default apiClient;
