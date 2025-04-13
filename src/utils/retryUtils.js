/**
 * Utility functions for handling API retries and rate limiting
 */

/**
 * Calculate exponential backoff delay with jitter
 * @param {number} retryCount - Current retry attempt (starting from 0)
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
export const calculateBackoff = (
  retryCount,
  baseDelay = 1000,
  maxDelay = 30000
) => {
  // Calculate exponential backoff: 2^retryCount * baseDelay
  const exponentialDelay = Math.min(
    Math.pow(2, retryCount) * baseDelay,
    maxDelay
  );

  // Add jitter (±20%) to prevent synchronized retries
  const jitter = 0.2;
  const min = exponentialDelay * (1 - jitter);
  const max = exponentialDelay * (1 + jitter);

  return Math.floor(min + Math.random() * (max - min));
};

/**
 * Check if an error is a rate limit error (429)
 * @param {Error} error - Error object from API call
 * @returns {boolean} - True if it's a rate limit error
 */
export const isRateLimitError = (error) => {
  return error?.status === 429 || error?.response?.status === 429;
};

/**
 * Get retry-after value from response headers
 * @param {Object} error - Error object from API call
 * @returns {number|null} - Retry after value in milliseconds or null
 */
export const getRetryAfter = (error) => {
  const retryAfter =
    error?.response?.headers?.["retry-after"] ||
    error?.response?.headers?.["Retry-After"];

  if (!retryAfter) return null;

  // If retry-after is in seconds (numeric string)
  if (!isNaN(retryAfter)) {
    return parseInt(retryAfter, 10) * 1000;
  }

  // If retry-after is a HTTP date
  try {
    const retryDate = new Date(retryAfter);
    const now = new Date();
    return retryDate.getTime() - now.getTime();
  } catch (e) {
    return null;
  }
};

// Request queue for managing rate-limited requests
export const requestQueue = {
  queue: {},
  processing: {},

  /**
   * Add a request to the queue
   * @param {string} endpoint - API endpoint
   * @param {Function} requestFn - Function that returns a promise for the request
   * @returns {Promise} - Promise that resolves with the request result
   */
  add(endpoint, requestFn) {
    // Create a normalized endpoint key to group similar requests
    const key = this.normalizeEndpoint(endpoint);

    // Initialize queue for this endpoint if it doesn't exist
    if (!this.queue[key]) {
      this.queue[key] = [];
      this.processing[key] = false;
    }

    // Create and return a new promise
    return new Promise((resolve, reject) => {
      // Add request to the queue
      this.queue[key].push({ requestFn, resolve, reject });

      // Start processing if not already processing
      if (!this.processing[key]) {
        this.processNext(key);
      }
    });
  },

  /**
   * Process the next request in the queue for a specific endpoint
   * @param {string} key - Normalized endpoint key
   */
  async processNext(key) {
    if (!this.queue[key] || this.queue[key].length === 0) {
      this.processing[key] = false;
      return;
    }

    this.processing[key] = true;
    const { requestFn, resolve, reject } = this.queue[key].shift();

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      // Process the next request after a delay based on the endpoint
      const delay = this.getDelayForEndpoint(key);
      setTimeout(() => this.processNext(key), delay);
    }
  },

  /**
   * Get delay time for an endpoint
   * @param {string} key - Normalized endpoint key
   * @returns {number} - Delay in milliseconds
   */
  getDelayForEndpoint(key) {
    // Define delays for different endpoint types
    const delays = {
      "/events": 1000,
      "/faculty": 1000,
      "/exams": 1000,
      "/users/profile": 2000,
      "/admin/profile": 2000,
      default: 500,
    };

    return delays[key] || delays.default;
  },

  /**
   * Normalize endpoint for queue management
   * @param {string} endpoint - API endpoint
   * @returns {string} - Normalized endpoint key
   */
  normalizeEndpoint(endpoint) {
    // Special cases
    if (endpoint.startsWith("/users/profile")) return "/users/profile";
    if (endpoint.startsWith("/admin/profile")) return "/admin/profile";
    if (endpoint.startsWith("/events/user-events"))
      return "/events/user-events";
    if (endpoint.startsWith("/events/upcoming")) return "/events/upcoming";
    if (endpoint === "/events") return "/events";
    if (endpoint === "/faculty") return "/faculty";
    if (endpoint === "/exams") return "/exams";

    // Remove IDs from paths like /events/123
    const parts = endpoint.split("/");
    if (parts.length >= 3) {
      // Check if the third part is an ID (numeric)
      if (!isNaN(parseInt(parts[2], 10))) {
        return `/${parts[1]}/:id`;
      }
    }

    return endpoint;
  },
};

/**
 * Execute a function with retry logic for rate limit errors
 * @param {Function} fn - Function to execute that returns a promise
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.baseDelay - Base delay in milliseconds
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @returns {Promise} - Promise that resolves with the function result
 */
export const executeWithRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    onRetry = null,
  } = options;

  let retryCount = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      // If it's not a rate limit error or we've reached max retries, throw
      if (!isRateLimitError(error) || retryCount >= maxRetries) {
        throw error;
      }

      // Calculate delay - use retry-after header if available
      const retryAfter = getRetryAfter(error);
      const delay =
        retryAfter || calculateBackoff(retryCount, baseDelay, maxDelay);

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry({
          error,
          retryCount,
          delay,
          willRetry: true,
        });
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      retryCount++;
    }
  }
};
