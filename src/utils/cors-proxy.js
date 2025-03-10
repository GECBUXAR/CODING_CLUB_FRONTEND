/**
 * Utility function to handle CORS issues by using a proxy if needed
 * @param {string} url - The original API URL
 * @returns {string} - The proxied URL if needed, or the original URL
 */
export const corsProxy = (url) => {
  // For simplicity, we'll always return the original URL in production
  // In a real app, you might use the commented code below with proper environment detection

  // Use the proxy only for external URLs (not localhost)
  if (!url.startsWith("http://localhost") && !url.includes("cors-anywhere")) {
    // Only enable this in development or when testing
    const useProxy = localStorage.getItem("useCorsProxy") === "true";

    if (useProxy) {
      return `https://cors-anywhere.herokuapp.com/${url}`;
    }
  }

  // Return URL as is
  return url;
};

/**
 * Shows a warning dialog about CORS issues if needed
 * @returns {boolean} - True if warning was shown, false otherwise
 */
export const showCorsWarningIfNeeded = () => {
  const corsWarningShown = localStorage.getItem("corsWarningShown");

  if (corsWarningShown !== "true") {
    localStorage.setItem("corsWarningShown", "true");
    return true;
  }

  return false;
};

/**
 * Enable or disable the CORS proxy
 * @param {boolean} enable - Whether to enable the proxy
 */
export const enableCorsProxy = (enable) => {
  localStorage.setItem("useCorsProxy", enable ? "true" : "false");
};
