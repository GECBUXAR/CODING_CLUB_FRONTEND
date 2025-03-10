import axios from "axios";

// API base URL - use relative URL for dev to make use of Vite's proxy
const API_BASE_URL = import.meta.env.PROD
  ? "https://coding-club-backend-ten.vercel.app/api/v1"
  : "/api/v1";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
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
      localStorage.removeItem("token");

      // You could implement auto-redirect here if needed
      // window.location.href = '/login';
    }

    return Promise.reject(customError);
  }
);

// Base timeout for API requests (ms)
const API_TIMEOUT = 30000;

// Helper to add timeout to requests
export const withTimeout = (promise, ms = API_TIMEOUT) => {
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
};

export default apiClient;
