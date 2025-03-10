/**
 * A simple utility to make API calls through a CORS proxy
 * This helps bypass CORS restrictions on the client side
 */

// CORS proxy URLs - will try in sequence if one fails
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url=",
];

/**
 * Makes a fetch request through a CORS proxy
 * @param {string} url - The API URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch response
 */
export async function fetchWithCorsProxy(url, options = {}) {
  let lastError = null;

  // Try each proxy in sequence
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options.headers,
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      console.warn(`CORS proxy ${proxy} failed:`, error);
      // Continue to try the next proxy
    }
  }

  // If all proxies fail, throw the last error
  throw new Error(
    `All CORS proxies failed. Last error: ${
      lastError?.message || "Unknown error"
    }`
  );
}

/**
 * Convenience method to fetch JSON data through a CORS proxy
 * @param {string} url - The API URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - JSON data
 */
export async function fetchJsonWithCorsProxy(url, options = {}) {
  const response = await fetchWithCorsProxy(url, options);
  return response.json();
}

export default {
  fetchWithCorsProxy,
  fetchJsonWithCorsProxy,
};
