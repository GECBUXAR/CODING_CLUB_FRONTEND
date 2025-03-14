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

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers for all requests
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Auth configuration
export const AUTH_CONFIG = {
  // Auth endpoints
  ENDPOINTS: {
    LOGIN: "/users/login",
    ADMIN_LOGIN: "/admin/login",
    SIGNUP: "/users/signup",
    ADMIN_SIGNUP: "/admin/signup",
    LOGOUT: "/users/logout",
    PROFILE: "/users/profile",
    ADMIN_PROFILE: "/admin/profile",
  },
};

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_ANALYTICS: !isDevelopment,
};

// Application settings
export const APP_CONFIG = {
  APP_NAME: "Coding Club",
  APP_VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@codingclub.com",
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  DATE_FORMAT: "MMMM d, yyyy",
  DEFAULT_PAGINATION_LIMIT: 10,
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again later.",
  NETWORK: "Network error. Please check your internet connection.",
  UNAUTHORIZED: "You need to log in to access this feature.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  SERVER: "Server error. Our team has been notified.",
  TIMEOUT: "Request timed out. Please try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Successfully logged in!",
  LOGOUT: "Successfully logged out!",
  REGISTER: "Registration successful!",
  UPDATE_PROFILE: "Profile updated successfully!",
  PASSWORD_CHANGE: "Password changed successfully!",
  FORM_SUBMIT: "Form submitted successfully!",
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  FEATURES,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
