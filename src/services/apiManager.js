/**
 * API Manager - Global API access control
 * 
 * This module provides a centralized way to manage API access across the application.
 * It prevents multiple components from making the same API calls and implements
 * aggressive throttling to prevent API flooding.
 */

import enhancedApiClient from './enhancedApi';

// Global state to track API requests
const apiState = {
  // Track if the app has been initialized
  initialized: false,
  
  // Track which endpoints have been requested
  requestedEndpoints: new Set(),
  
  // Track which endpoints are currently loading
  loadingEndpoints: new Set(),
  
  // Track which endpoints have been loaded
  loadedEndpoints: new Set(),
  
  // Track the last time each endpoint was requested
  lastRequestTime: {},
  
  // Minimum time between requests to the same endpoint (ms)
  minRequestInterval: 10000, // 10 seconds
  
  // Critical endpoints that should be loaded first
  criticalEndpoints: ['/users/profile', '/auth/check'],
  
  // Common endpoints that are used across multiple pages
  commonEndpoints: ['/faculty', '/events', '/exams'],
  
  // Listeners for endpoint loading
  listeners: {},
};

/**
 * Initialize the API manager
 * This should be called once when the application starts
 */
export const initializeApiManager = async () => {
  if (apiState.initialized) {
    console.log('API Manager already initialized');
    return;
  }
  
  console.log('Initializing API Manager...');
  apiState.initialized = true;
  
  // Load critical endpoints first
  for (const endpoint of apiState.criticalEndpoints) {
    await loadEndpoint(endpoint, true);
  }
  
  // Load common endpoints with a delay to prevent API flooding
  setTimeout(() => {
    apiState.commonEndpoints.forEach((endpoint, index) => {
      // Stagger the loading of common endpoints
      setTimeout(() => {
        loadEndpoint(endpoint, true);
      }, index * 3000); // 3 second delay between each endpoint
    });
  }, 2000); // Initial delay before loading common endpoints
};

/**
 * Load data from an endpoint
 * @param {string} endpoint - API endpoint to load
 * @param {boolean} force - Force reload even if already loaded
 * @returns {Promise} - Promise that resolves with the response data
 */
export const loadEndpoint = async (endpoint, force = false) => {
  // Check if the endpoint is already loading
  if (apiState.loadingEndpoints.has(endpoint)) {
    console.log(`Endpoint ${endpoint} is already loading, waiting...`);
    return new Promise((resolve, reject) => {
      // Add a listener for this endpoint
      if (!apiState.listeners[endpoint]) {
        apiState.listeners[endpoint] = [];
      }
      
      apiState.listeners[endpoint].push({ resolve, reject });
    });
  }
  
  // Check if the endpoint has already been loaded and we're not forcing a reload
  if (!force && apiState.loadedEndpoints.has(endpoint)) {
    console.log(`Using cached data for ${endpoint}`);
    return enhancedApiClient.getCachedResponse(endpoint);
  }
  
  // Check if we need to throttle this request
  const now = Date.now();
  const lastRequestTime = apiState.lastRequestTime[endpoint] || 0;
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < apiState.minRequestInterval) {
    console.log(`Throttling request to ${endpoint} (too frequent)`);
    
    // Use cached data if available
    const cachedData = enhancedApiClient.getCachedResponse(endpoint);
    if (cachedData) {
      return cachedData;
    }
    
    // If no cached data, wait until we can make the request
    const waitTime = apiState.minRequestInterval - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  // Mark the endpoint as loading
  apiState.loadingEndpoints.add(endpoint);
  apiState.requestedEndpoints.add(endpoint);
  apiState.lastRequestTime[endpoint] = Date.now();
  
  try {
    // Make the API request
    console.log(`Loading data from ${endpoint}...`);
    const response = await enhancedApiClient.get(endpoint, {}, true);
    
    // Mark the endpoint as loaded
    apiState.loadedEndpoints.add(endpoint);
    apiState.loadingEndpoints.delete(endpoint);
    
    // Notify any listeners
    if (apiState.listeners[endpoint]) {
      apiState.listeners[endpoint].forEach(listener => {
        listener.resolve(response);
      });
      delete apiState.listeners[endpoint];
    }
    
    return response;
  } catch (error) {
    // Mark the endpoint as not loading
    apiState.loadingEndpoints.delete(endpoint);
    
    // Notify any listeners of the error
    if (apiState.listeners[endpoint]) {
      apiState.listeners[endpoint].forEach(listener => {
        listener.reject(error);
      });
      delete apiState.listeners[endpoint];
    }
    
    throw error;
  }
};

/**
 * Check if an endpoint has been loaded
 * @param {string} endpoint - API endpoint to check
 * @returns {boolean} - True if the endpoint has been loaded
 */
export const isEndpointLoaded = (endpoint) => {
  return apiState.loadedEndpoints.has(endpoint);
};

/**
 * Check if an endpoint is currently loading
 * @param {string} endpoint - API endpoint to check
 * @returns {boolean} - True if the endpoint is currently loading
 */
export const isEndpointLoading = (endpoint) => {
  return apiState.loadingEndpoints.has(endpoint);
};

/**
 * Clear the cache for an endpoint
 * @param {string} endpoint - API endpoint to clear
 */
export const clearEndpointCache = (endpoint) => {
  apiState.loadedEndpoints.delete(endpoint);
  enhancedApiClient.clearCacheForEndpoint(endpoint);
};

/**
 * Clear all caches
 */
export const clearAllCaches = () => {
  apiState.loadedEndpoints.clear();
  enhancedApiClient.cache.clear();
};

export default {
  initializeApiManager,
  loadEndpoint,
  isEndpointLoaded,
  isEndpointLoading,
  clearEndpointCache,
  clearAllCaches,
};
