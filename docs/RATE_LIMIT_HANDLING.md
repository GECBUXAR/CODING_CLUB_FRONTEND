# Rate Limit Handling

This document explains how the application handles rate limiting from the backend API.

## Overview

The application implements a comprehensive rate limit handling strategy to gracefully handle 429 (Too Many Requests) errors from the backend API. This includes:

1. Automatic retries with exponential backoff and jitter
2. User notifications for rate limit errors with countdown timers
3. Smart request queuing by endpoint to prevent API flooding
4. Response caching to reduce duplicate requests
5. Enhanced error handling in services

## Components

### 1. Retry Utilities (`src/utils/retryUtils.js`)

This utility provides functions for handling API retries and rate limiting:

- `executeWithRetry`: Executes a function with retry logic for rate limit errors
- `calculateBackoff`: Calculates exponential backoff delay with jitter
- `isRateLimitError`: Checks if an error is a rate limit error (429)
- `getRetryAfter`: Gets retry-after value from response headers
- `requestQueue`: Manages endpoint-specific queues for rate-limited requests
  - Normalizes endpoints to group similar requests
  - Applies different delays based on endpoint type
  - Prevents flooding the API with too many requests

### 2. Enhanced API Client (`src/services/enhancedApi.js`)

An enhanced version of the API client with built-in retry logic:

- Automatically retries requests that fail with 429 errors
- Uses exponential backoff with jitter to prevent thundering herd problems
- Implements response caching to reduce duplicate requests
- Queues requests by endpoint to prevent API flooding
- Dispatches events for UI notifications
- Provides access to the original API client for direct access if needed

### 3. Rate Limit Context (`src/contexts/rate-limit-context.jsx`)

A React context for managing rate limit notifications across the app:

- `showRateLimitNotification`: Shows a rate limit notification with endpoint and retry information
- `hideRateLimitNotification`: Hides a rate limit notification
- `isRateLimitError`: Checks if an error is a rate limit error
- `handleRateLimitError`: Handles a rate limit error and shows a notification
- Listens for global rate limit events from the API client
- Prevents duplicate notifications for the same endpoint

### 4. Rate Limit Notification Component (`src/components/common/RateLimitNotification.jsx`)

A React component for displaying rate limit notifications:

- Shows a toast notification when API rate limits are hit
- Displays a countdown timer for retry-after duration
- Shows the affected endpoint and retry attempt information
- Allows users to dismiss the notification
- Automatically hides after the retry period

## Usage

### In Services

Services should use the enhanced API client for all API calls:

```javascript
import enhancedApiClient from "./enhancedApi";

const myService = {
  getData: async (params, useCache = true) => {
    try {
      // Third parameter enables/disables caching
      const response = await enhancedApiClient.get("/endpoint", { params }, useCache);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch data",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },
};
```

### In Components

Components can use the `useRateLimit` hook to handle rate limit errors:

```javascript
import { useRateLimit } from "../contexts/rate-limit-context";

function MyComponent() {
  const { handleRateLimitError } = useRateLimit();

  const fetchData = async () => {
    try {
      const result = await myService.getData();

      if (!result.success) {
        // Check if it's a rate limit error
        if (result.isRateLimitError) {
          handleRateLimitError({
            status: 429,
            message: result.error,
            response: { headers: { 'retry-after': result.retryAfter / 1000 } }
          });
          return;
        }

        // Handle other errors
        console.error(result.error);
      }

      // Process successful result
      // ...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={fetchData}>Fetch Data</button>
  );
}
```

## Configuration

### Retry Logic

The retry logic can be configured in the `enhancedApi.js` file:

- `maxRetries`: Maximum number of retries (default: 3 for GET, 2 for mutations)
- `baseDelay`: Base delay in milliseconds (default: 1000ms for GET, 2000ms for mutations)
- `maxDelay`: Maximum delay in milliseconds (default: 10000ms)

### Request Queue

The request queue can be configured in the `retryUtils.js` file:

- `getDelayForEndpoint`: Configure delays for different endpoint types
- `normalizeEndpoint`: Configure how endpoints are grouped for queuing

### Caching

The response cache can be configured in the `enhancedApi.js` file:

- Default TTL: 30 seconds (configurable per request)
- Cache can be bypassed by setting `useCache = false` in API calls
- Cache can be manually cleared with `enhancedApiClient.cache.clear()`

## Backend Rate Limits

The backend API implements the following rate limits:

- General API: 100 requests per 15 minutes
- Authentication: 10 requests per 15 minutes
- User creation: 5 requests per hour
- Password reset: 3 requests per hour

These limits are enforced per IP address.
