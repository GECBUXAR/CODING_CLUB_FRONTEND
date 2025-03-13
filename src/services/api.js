import axios from "axios";
import { API_CONFIG } from "../config";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  withCredentials: true, // Important for cookies
  timeout: API_CONFIG.TIMEOUT,
});

// Track recent API calls to prevent repeated calls to the same endpoint
const apiCallTracker = {
  // Store timestamps of recent calls to specific endpoints
  recentCalls: {},

  // Minimum time between calls to the same endpoint (in ms)
  throttleTime: {
    "/users/profile": 5000, // 5 seconds for profile endpoints
    "/events": 5000, // 5 seconds for events endpoints
    "/events/user-events": 5000, // 5 seconds for user events endpoints
    default: 0, // No throttling for other endpoints
  },

  // Check if a call to this endpoint is allowed
  shouldAllowCall(endpoint) {
    const now = Date.now();
    const normalizedEndpoint = this.normalizeEndpoint(endpoint);
    const lastCallTime = this.recentCalls[normalizedEndpoint] || 0;
    const throttleTime =
      this.throttleTime[normalizedEndpoint] || this.throttleTime.default;

    // If enough time has passed since the last call, allow it
    if (now - lastCallTime > throttleTime) {
      this.recentCalls[normalizedEndpoint] = now;
      return true;
    }

    console.log(`Throttled API call to ${endpoint} (called too frequently)`);
    return false;
  },

  // Normalize endpoint for throttling check (remove query params and ids)
  normalizeEndpoint(endpoint) {
    // Special cases
    if (endpoint.startsWith("/users/profile")) return "/users/profile";
    if (endpoint.startsWith("/events/user-events"))
      return "/events/user-events";
    if (endpoint === "/events") return "/events";

    // Remove IDs from paths like /events/123
    const parts = endpoint.split("/");
    if (
      parts.length >= 3 &&
      parts[1] === "events" &&
      !Number.isNaN(Number.parseInt(parts[2], 10))
    ) {
      return "/events/:id";
    }

    return endpoint;
  },
};

// Add request interceptor for logging and request formatting
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log("Request data:", config.data);
      }
    }

    // Skip throttling for non-GET requests
    if (config.method?.toLowerCase() !== "get") {
      config.withCredentials = true;
      return config;
    }

    // Check if we should throttle this endpoint
    const endpoint = config.url || "";
    if (!apiCallTracker.shouldAllowCall(endpoint)) {
      // Cancel the request if it's being called too frequently
      return {
        ...config,
        cancelToken: new axios.CancelToken((cancel) =>
          cancel(`Request to ${endpoint} was throttled to prevent API flooding`)
        ),
      };
    }

    // Ensure withCredentials is always true for any request
    config.withCredentials = true;

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
    // If the request was canceled due to throttling, just return a cached-like response
    if (axios.isCancel(error)) {
      console.log(error.message);
      // Return a mock response to prevent components from breaking
      return Promise.resolve({
        status: 304, // Not Modified
        data: { cachedResponse: true, message: "Request throttled" },
        headers: {},
        config: {}, // Create a new empty config object instead of referencing error.config
      });
    }

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

    // Handle 401 unauthorized errors (token expired or invalid)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Authentication error:", error.response?.status);
      // Dispatch an auth error event that can be used to redirect to login
      window.dispatchEvent(
        new CustomEvent("auth-error", {
          detail: {
            status: error.response?.status,
          },
        })
      );
    }

    return Promise.reject(customError);
  }
);

// Helper function to create a timeout for specific requests
export const withTimeout = (timeoutMs) => {
  return {
    timeout: timeoutMs,
  };
};

export default apiClient;
