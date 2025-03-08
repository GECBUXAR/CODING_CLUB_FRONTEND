/**
 * CORS Helper functions to work around CORS issues with remote APIs
 */

// Setup CORS proxy URL - only use in development
const CORS_PROXY = "https://corsproxy.io/?";

/**
 * Wraps a URL with a CORS proxy if needed
 * @param {string} url - URL to wrap
 * @param {boolean} useProxy - Whether to use proxy
 * @param {boolean} withCredentials - Whether credentials are being sent
 * @returns {string} - URL wrapped with proxy if needed
 */
export const corsUrl = (url, useProxy = false, withCredentials = true) => {
  if (!useProxy) return url;

  // Check if we're in development mode
  const isDev =
    typeof window !== "undefined" && window.location.hostname === "localhost";

  // Don't use proxy for auth endpoints when credentials are needed
  // This avoids the "Access-Control-Allow-Origin cannot be * when credentials are used" issue
  if (isDev && useProxy) {
    if (withCredentials) {
      // Don't use proxy for credential requests, let the server handle CORS directly
      return url;
    }
    // Only use proxy for non-credential requests or specific auth endpoints
    return `${CORS_PROXY}${encodeURIComponent(url)}`;
  }

  return url;
};

/**
 * Prepare headers for CORS requests
 * @param {boolean} withAuth - Whether to include auth headers
 * @returns {Object} Headers object
 */
export const corsHeaders = (withAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (withAuth) {
    headers["X-Requested-With"] = "XMLHttpRequest";
  }

  return headers;
};

export default {
  corsUrl,
  corsHeaders,
};
