/**
 * Application-wide configuration settings
 */

// Environment detection
const isDevelopment =
  import.meta.env.DEV || window?.location?.hostname === "localhost";

// API configuration
export const API_CONFIG = {
  // Base URL for all API requests
  BASE_URL: isDevelopment
    ? "/api/v1" // Use Vite's proxy in development
    : "https://coding-club-backend-ten.vercel.app/api/v1",

  // Request timeout in milliseconds (reducing from 30000ms to 10000ms)
  TIMEOUT: 10000,

  // Default headers for all requests
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Auth configuration
export const AUTH_CONFIG = {
  // LocalStorage key for auth token
  TOKEN_KEY: "token",

  // Auth endpoints
  ENDPOINTS: {
    LOGIN: "/users/login",
    ADMIN_LOGIN: "/admin/login",
    SIGNUP: "/users/signup",
    ADMIN_SIGNUP: "/admin/signup",
    LOGOUT: "/users/logout",
    PROFILE: "/users/profile",
  },
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
};
