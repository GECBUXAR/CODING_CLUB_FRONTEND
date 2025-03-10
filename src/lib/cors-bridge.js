/**
 * CORS Bridge - A utility to handle authentication requests through a popup window
 * to avoid CORS issues with credentials and wildcard origins
 */

// Base URL for the CORS bridge HTML page
const BRIDGE_URL = "/cors-bridge.html";

/**
 * Open a popup window for authentication
 * @param {string} endpoint - The endpoint to use (login, signup, me)
 * @param {Object} payload - The data to send
 * @returns {Promise} - Resolves with the response data
 */
export function openAuthPopup(endpoint, payload) {
  return new Promise((resolve, reject) => {
    // Open popup window
    const popup = window.open(
      BRIDGE_URL,
      "corsbridge",
      "width=600,height=600,toolbar=0,menubar=0,location=0"
    );

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups for this site."));
      return;
    }

    // Set timeout to reject if taking too long
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Authentication request timed out."));
    }, 60000); // 1 minute timeout

    // Listen for messages from the popup
    const messageHandler = (event) => {
      if (event.source !== popup) return;

      // Bridge is ready, send the request
      if (event.data.type === "CORS_BRIDGE_READY") {
        popup.postMessage(
          {
            type: "AUTH_REQUEST",
            endpoint,
            payload,
          },
          "*"
        );
      }

      // Auth was successful
      if (event.data.type === "AUTH_SUCCESS") {
        cleanup();
        resolve(event.data);
      }

      // Auth failed
      if (event.data.type === "AUTH_ERROR") {
        cleanup();
        reject(new Error(event.data.message || "Authentication failed"));
      }
    };

    // Clean up event listeners and timers
    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener("message", messageHandler);
      if (!popup.closed) {
        popup.close();
      }
    };

    // Add message listener
    window.addEventListener("message", messageHandler);

    // Handle popup closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        cleanup();
        reject(new Error("Authentication window was closed."));
      }
    }, 1000);
  });
}

/**
 * Login using the CORS bridge
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise} - Resolves with the user data and token
 */
export async function loginWithBridge(credentials) {
  try {
    const result = await openAuthPopup("login", credentials);
    return {
      success: true,
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Signup using the CORS bridge
 * @param {Object} userData - User registration data
 * @returns {Promise} - Resolves with the user data and token
 */
export async function signupWithBridge(userData) {
  try {
    const result = await openAuthPopup("signup", userData);
    return {
      success: true,
      user: result.user,
      token: result.token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check authentication status using the CORS bridge
 * @returns {Promise} - Resolves with the user data
 */
export async function checkAuthWithBridge() {
  try {
    const result = await openAuthPopup("me", null);
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  loginWithBridge,
  signupWithBridge,
  checkAuthWithBridge,
  openAuthPopup,
};
