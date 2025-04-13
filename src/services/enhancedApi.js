import apiClient from "./api";
import {
  isRateLimitError,
  getRetryAfter,
  executeWithRetry,
} from "../utils/retryUtils";

// Event name for rate limit notifications
const RATE_LIMIT_EVENT = "rate-limit-error";

// Global settings for API request management
const API_SETTINGS = {
  // Maximum number of concurrent requests - more conservative to prevent rate limiting
  MAX_CONCURRENT_REQUESTS: 1,

  // Minimum time between requests in milliseconds
  MIN_REQUEST_INTERVAL: 1000,

  // Default cache TTL (10 minutes - increased to reduce API load)
  DEFAULT_CACHE_TTL: 600000,

  // Default retry settings
  DEFAULT_RETRY_SETTINGS: {
    maxRetries: 3,
    baseDelay: 2000, // Increased base delay
    maxDelay: 15000, // Increased max delay
  },

  // Endpoints that should be prioritized
  PRIORITY_ENDPOINTS: ["/users/profile", "/auth/check"],

  // Endpoints that can be cached for longer periods (30 minutes)
  LONG_CACHE_ENDPOINTS: ["/faculty", "/events", "/exams"],

  // Time to wait between processing queue items (ms)
  QUEUE_PROCESSING_DELAY: 1500,
};

// Cache for storing responses to avoid duplicate requests
const responseCache = {
  cache: {},
  inFlightRequests: {},

  /**
   * Get cached response for an endpoint
   * @param {string} endpoint - API endpoint
   * @returns {Object|null} - Cached response or null
   */
  get(endpoint) {
    const cacheKey = this.getCacheKey(endpoint);
    const cachedItem = this.cache[cacheKey];

    if (!cachedItem) return null;

    // Check if cache is still valid
    const now = Date.now();
    if (now - cachedItem.timestamp > cachedItem.ttl) {
      // Cache expired
      delete this.cache[cacheKey];
      return null;
    }

    return cachedItem.data;
  },

  /**
   * Check if there's an in-flight request for this endpoint
   * @param {string} endpoint - API endpoint
   * @returns {Promise|null} - Promise for the in-flight request or null
   */
  getInFlightRequest(endpoint) {
    const cacheKey = this.getCacheKey(endpoint);
    return this.inFlightRequests[cacheKey] || null;
  },

  /**
   * Set an in-flight request for this endpoint
   * @param {string} endpoint - API endpoint
   * @param {Promise} promise - Promise for the request
   */
  setInFlightRequest(endpoint, promise) {
    const cacheKey = this.getCacheKey(endpoint);
    this.inFlightRequests[cacheKey] = promise;

    // Clean up the in-flight request when it completes
    promise.finally(() => {
      if (this.inFlightRequests[cacheKey] === promise) {
        delete this.inFlightRequests[cacheKey];
      }
    });
  },

  /**
   * Set cached response for an endpoint
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Response data
   * @param {number} ttl - Time to live in milliseconds
   */
  set(endpoint, data, ttl) {
    // Determine appropriate TTL based on endpoint
    let cacheTTL = ttl;

    if (!cacheTTL) {
      // Use longer cache for certain endpoints
      if (
        API_SETTINGS.LONG_CACHE_ENDPOINTS.some((e) => endpoint.startsWith(e))
      ) {
        cacheTTL = API_SETTINGS.DEFAULT_CACHE_TTL * 2; // 10 minutes
      } else {
        cacheTTL = API_SETTINGS.DEFAULT_CACHE_TTL; // 5 minutes
      }
    }

    const cacheKey = this.getCacheKey(endpoint);
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL,
    };
  },

  /**
   * Generate cache key for an endpoint
   * @param {string} endpoint - API endpoint
   * @returns {string} - Cache key
   */
  getCacheKey(endpoint) {
    // Remove query parameters for caching
    return endpoint.split("?")[0];
  },

  /**
   * Clear all cached responses
   */
  clear() {
    this.cache = {};
  },

  /**
   * Clear cache for a specific endpoint
   * @param {string} endpoint - API endpoint to clear cache for
   */
  clearEndpoint(endpoint) {
    const cacheKey = this.getCacheKey(endpoint);
    delete this.cache[cacheKey];
  },
};

// Using the RATE_LIMIT_EVENT defined above

/**
 * Enhanced API client with retry logic for rate limiting
 */
const enhancedApiClient = {
  // Track active requests count
  activeRequests: 0,

  // Queue for pending requests
  requestQueue: [],

  // Track the last request time
  lastRequestTime: 0,

  /**
   * Process the next request in the queue if under the concurrent limit
   */
  processQueue() {
    // If we're already at the limit, don't process more
    if (this.activeRequests >= API_SETTINGS.MAX_CONCURRENT_REQUESTS) {
      return;
    }

    // If there are no requests in the queue, nothing to do
    if (this.requestQueue.length === 0) {
      return;
    }

    // Check if we need to wait before making another request
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < API_SETTINGS.MIN_REQUEST_INTERVAL) {
      // Wait until the minimum interval has passed
      const waitTime = API_SETTINGS.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    // Get the next request from the queue
    const nextRequest = this.requestQueue.shift();

    // Update the last request time
    this.lastRequestTime = Date.now();

    // Increment active requests count
    this.activeRequests++;

    // Execute the request
    nextRequest
      .execute()
      .then(nextRequest.resolve)
      .catch(nextRequest.reject)
      .finally(() => {
        // Decrement active requests count
        this.activeRequests--;

        // Process the next request in the queue after a delay
        // This ensures we don't flood the API with requests
        setTimeout(
          () => this.processQueue(),
          API_SETTINGS.QUEUE_PROCESSING_DELAY
        );
      });
  },

  /**
   * Add a request to the queue
   * @param {Function} requestFn - Function that returns a promise
   * @param {boolean} isPriority - Whether this is a priority request
   * @returns {Promise} - Promise that resolves with the request result
   */
  enqueueRequest(requestFn, isPriority = false) {
    return new Promise((resolve, reject) => {
      const request = {
        execute: requestFn,
        resolve,
        reject,
        isPriority,
      };

      // Add to the front of the queue if priority, otherwise to the back
      if (isPriority) {
        this.requestQueue.unshift(request);
      } else {
        this.requestQueue.push(request);
      }

      // Try to process the queue
      this.processQueue();
    });
  },

  /**
   * Perform a GET request with retry logic for rate limiting
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @param {boolean} useCache - Whether to use cache for this request
   * @returns {Promise} - API response
   */
  async get(url, config = {}, useCache = true) {
    // Check if this is a priority endpoint
    const isPriority = API_SETTINGS.PRIORITY_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint)
    );

    // Check cache first if caching is enabled
    if (useCache) {
      const cachedResponse = responseCache.get(url);
      if (cachedResponse) {
        console.log(`Using cached response for ${url}`);
        return cachedResponse;
      }
    }

    // Check if there's already an in-flight request for this URL
    const existingRequest = responseCache.getInFlightRequest(url);
    if (existingRequest && useCache) {
      console.log(`Reusing in-flight request for ${url}`);
      return existingRequest;
    }

    // Create the request function
    const makeRequest = async () => {
      try {
        // Try to make the request with retry logic
        const response = await executeWithRetry(
          () => apiClient.get(url, config),
          {
            maxRetries: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxRetries,
            baseDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.baseDelay,
            maxDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxDelay,
            onRetry: ({ error, retryCount, delay }) => {
              console.log(
                `Retrying GET ${url} after rate limit (attempt ${
                  retryCount + 1
                }). Waiting ${delay}ms`
              );

              // Dispatch event for UI notification
              window.dispatchEvent(
                new CustomEvent(RATE_LIMIT_EVENT, {
                  detail: {
                    status: error.response?.status,
                    message: `Rate limit exceeded. Retrying in ${Math.ceil(
                      delay / 1000
                    )} seconds...`,
                    retryAfter: delay,
                    endpoint: url,
                    retryCount: retryCount + 1,
                  },
                })
              );
            },
          }
        );

        // Cache successful responses
        if (useCache && response && response.status === 200) {
          // Use appropriate TTL based on endpoint type
          const ttl = API_SETTINGS.LONG_CACHE_ENDPOINTS.some((e) =>
            url.startsWith(e)
          )
            ? API_SETTINGS.DEFAULT_CACHE_TTL * 2 // 10 minutes for frequently accessed endpoints
            : API_SETTINGS.DEFAULT_CACHE_TTL; // 5 minutes for other endpoints

          responseCache.set(url, response, ttl);
        }

        return response;
      } catch (error) {
        // If it's a rate limit error, notify the user
        if (isRateLimitError(error)) {
          window.dispatchEvent(
            new CustomEvent(RATE_LIMIT_EVENT, {
              detail: {
                status: 429,
                message: "Too many requests. Please try again later.",
                retryAfter: getRetryAfter(error) || 5000,
                endpoint: url,
              },
            })
          );
        }
        throw error;
      }
    };

    // Create a promise for the request
    const requestPromise = this.enqueueRequest(() => makeRequest(), isPriority);

    // Store the in-flight request
    if (useCache) {
      responseCache.setInFlightRequest(url, requestPromise);
    }

    return requestPromise;
  },

  /**
   * Perform a POST request with retry logic for rate limiting
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} - API response
   */
  async post(url, data, config = {}) {
    // Check if this is a priority endpoint
    const isPriority = API_SETTINGS.PRIORITY_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint)
    );

    // Clear cache for this endpoint since we're modifying data
    responseCache.clearEndpoint(url);

    // Create the request function
    const makeRequest = async () => {
      try {
        // Try to make the request with retry logic
        return await executeWithRetry(() => apiClient.post(url, data, config), {
          maxRetries: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxRetries,
          baseDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.baseDelay,
          maxDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxDelay,
          onRetry: ({ error, retryCount, delay }) => {
            console.log(
              `Retrying POST ${url} after rate limit (attempt ${
                retryCount + 1
              }). Waiting ${delay}ms`
            );

            // Dispatch event for UI notification
            window.dispatchEvent(
              new CustomEvent(RATE_LIMIT_EVENT, {
                detail: {
                  status: error.response?.status,
                  message: `Rate limit exceeded. Retrying in ${Math.ceil(
                    delay / 1000
                  )} seconds...`,
                  retryAfter: delay,
                  endpoint: url,
                  retryCount: retryCount + 1,
                },
              })
            );
          },
        });
      } catch (error) {
        // If it's a rate limit error, notify the user
        if (isRateLimitError(error)) {
          window.dispatchEvent(
            new CustomEvent(RATE_LIMIT_EVENT, {
              detail: {
                status: 429,
                message: "Too many requests. Please try again later.",
                retryAfter: getRetryAfter(error) || 5000,
                endpoint: url,
              },
            })
          );
        }
        throw error;
      }
    };

    // Create a promise for the request and add it to the queue
    return this.enqueueRequest(() => makeRequest(), isPriority);
  },

  /**
   * Perform a PUT request with retry logic for rate limiting
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} - API response
   */
  async put(url, data, config = {}) {
    // Check if this is a priority endpoint
    const isPriority = API_SETTINGS.PRIORITY_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint)
    );

    // Clear cache for this endpoint since we're modifying data
    responseCache.clearEndpoint(url);

    // Create the request function
    const makeRequest = async () => {
      try {
        // Try to make the request with retry logic
        return await executeWithRetry(() => apiClient.put(url, data, config), {
          maxRetries: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxRetries,
          baseDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.baseDelay,
          maxDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxDelay,
          onRetry: ({ error, retryCount, delay }) => {
            console.log(
              `Retrying PUT ${url} after rate limit (attempt ${
                retryCount + 1
              }). Waiting ${delay}ms`
            );

            // Dispatch event for UI notification
            window.dispatchEvent(
              new CustomEvent(RATE_LIMIT_EVENT, {
                detail: {
                  status: error.response?.status,
                  message: `Rate limit exceeded. Retrying in ${Math.ceil(
                    delay / 1000
                  )} seconds...`,
                  retryAfter: delay,
                  endpoint: url,
                  retryCount: retryCount + 1,
                },
              })
            );
          },
        });
      } catch (error) {
        // If it's a rate limit error, notify the user
        if (isRateLimitError(error)) {
          window.dispatchEvent(
            new CustomEvent(RATE_LIMIT_EVENT, {
              detail: {
                status: 429,
                message: "Too many requests. Please try again later.",
                retryAfter: getRetryAfter(error) || 5000,
                endpoint: url,
              },
            })
          );
        }
        throw error;
      }
    };

    // Create a promise for the request and add it to the queue
    return this.enqueueRequest(() => makeRequest(), isPriority);
  },

  /**
   * Perform a DELETE request with retry logic for rate limiting
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @returns {Promise} - API response
   */
  async delete(url, config = {}) {
    // Check if this is a priority endpoint
    const isPriority = API_SETTINGS.PRIORITY_ENDPOINTS.some((endpoint) =>
      url.startsWith(endpoint)
    );

    // Clear cache for this endpoint since we're modifying data
    responseCache.clearEndpoint(url);

    // Create the request function
    const makeRequest = async () => {
      try {
        // Try to make the request with retry logic
        return await executeWithRetry(() => apiClient.delete(url, config), {
          maxRetries: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxRetries,
          baseDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.baseDelay,
          maxDelay: API_SETTINGS.DEFAULT_RETRY_SETTINGS.maxDelay,
          onRetry: ({ error, retryCount, delay }) => {
            console.log(
              `Retrying DELETE ${url} after rate limit (attempt ${
                retryCount + 1
              }). Waiting ${delay}ms`
            );

            // Dispatch event for UI notification
            window.dispatchEvent(
              new CustomEvent(RATE_LIMIT_EVENT, {
                detail: {
                  status: error.response?.status,
                  message: `Rate limit exceeded. Retrying in ${Math.ceil(
                    delay / 1000
                  )} seconds...`,
                  retryAfter: delay,
                  endpoint: url,
                  retryCount: retryCount + 1,
                },
              })
            );
          },
        });
      } catch (error) {
        // If it's a rate limit error, notify the user
        if (isRateLimitError(error)) {
          window.dispatchEvent(
            new CustomEvent(RATE_LIMIT_EVENT, {
              detail: {
                status: 429,
                message: "Too many requests. Please try again later.",
                retryAfter: getRetryAfter(error) || 5000,
                endpoint: url,
              },
            })
          );
        }
        throw error;
      }
    };

    // Create a promise for the request and add it to the queue
    return this.enqueueRequest(() => makeRequest(), isPriority);
  },

  // Add the original axios instance for direct access if needed
  axios: apiClient,

  // Add a method to check if an error is a rate limit error
  isRateLimitError,

  // Add a method to get retry-after from error
  getRetryAfter,

  // Add cache control methods
  cache: {
    clear: () => responseCache.clear(),
    get: (url) => responseCache.get(url),
    set: (url, data, ttl = 300000) => responseCache.set(url, data, ttl),
    clearEndpoint: (url) => responseCache.clearEndpoint(url),
  },

  // Method to get cached response
  getCachedResponse(url) {
    return responseCache.get(url);
  },

  // Method to set cached response
  setCachedResponse(url, data, ttl) {
    return responseCache.set(url, data, ttl);
  },

  // Method to clear cache for a specific endpoint
  clearCacheForEndpoint(url) {
    return responseCache.clearEndpoint(url);
  },
};

// Listen for rate limit events to handle them globally
window.addEventListener(RATE_LIMIT_EVENT, (event) => {
  // We know this is a CustomEvent with detail
  if (event && typeof event === "object" && "detail" in event) {
    const detail = event.detail || {};
    // Extract properties safely
    const message = detail.message || "Rate limit exceeded";
    const retryAfter = detail.retryAfter || 0;
    const endpoint = detail.endpoint || "unknown";
    const retryCount = detail.retryCount || 0;

    if (message && endpoint) {
      console.warn(
        `Rate limit exceeded for ${endpoint}. Retry attempt ${retryCount} after ${retryAfter}ms. Message: ${message}`
      );
    }
  }
});

export default enhancedApiClient;
