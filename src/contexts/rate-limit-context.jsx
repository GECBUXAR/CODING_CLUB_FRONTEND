import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import RateLimitNotification from "../components/common/RateLimitNotification";

// Global event name for rate limit notifications
const RATE_LIMIT_EVENT = "rate-limit-error";

// Create context
const RateLimitContext = createContext(null);

/**
 * Provider component for rate limit notifications
 */
export const RateLimitProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    retryAfter: null,
    endpoint: null,
    retryCount: 0,
  });

  // Track active rate-limited endpoints to avoid showing multiple notifications
  const [rateLimitedEndpoints, setRateLimitedEndpoints] = useState({});

  // Show rate limit notification
  const showRateLimitNotification = useCallback(
    (message, retryAfter = null, endpoint = null, retryCount = 0) => {
      // If we already have a notification for this endpoint and the retry count is lower, ignore it
      if (
        endpoint &&
        rateLimitedEndpoints[endpoint] &&
        rateLimitedEndpoints[endpoint] >= retryCount
      ) {
        return;
      }

      // Update the rate limited endpoints
      if (endpoint) {
        setRateLimitedEndpoints((prev) => ({
          ...prev,
          [endpoint]: retryCount,
        }));
      }

      setNotification({
        isVisible: true,
        message:
          message ||
          "Too many requests. Please wait a moment before trying again.",
        retryAfter,
        endpoint,
        retryCount,
      });

      // Auto-hide after retryAfter + 1 second (if retryAfter is provided)
      if (retryAfter) {
        setTimeout(() => {
          setNotification((prev) => {
            // Only hide if this is still the same notification
            if (prev.endpoint === endpoint && prev.retryCount === retryCount) {
              return {
                ...prev,
                isVisible: false,
              };
            }
            return prev;
          });

          // Remove from rate limited endpoints
          if (endpoint) {
            setRateLimitedEndpoints((prev) => {
              const newEndpoints = { ...prev };
              delete newEndpoints[endpoint];
              return newEndpoints;
            });
          }
        }, retryAfter + 1000);
      }
    },
    [rateLimitedEndpoints]
  );

  // Hide rate limit notification
  const hideRateLimitNotification = useCallback(() => {
    setNotification((prev) => {
      // Remove from rate limited endpoints
      if (prev.endpoint) {
        setRateLimitedEndpoints((prevEndpoints) => {
          const newEndpoints = { ...prevEndpoints };
          delete newEndpoints[prev.endpoint];
          return newEndpoints;
        });
      }

      return {
        ...prev,
        isVisible: false,
      };
    });
  }, []);

  // Check if an error is a rate limit error
  const isRateLimitError = useCallback((error) => {
    return error?.status === 429 || error?.response?.status === 429;
  }, []);

  // Handle rate limit error
  const handleRateLimitError = useCallback(
    (error) => {
      if (isRateLimitError(error)) {
        // Get retry-after from headers if available
        const retryAfter =
          error?.response?.headers?.["retry-after"] ||
          error?.response?.headers?.["Retry-After"];

        let retryMs = null;

        if (retryAfter) {
          // If retry-after is in seconds (numeric string)
          if (!isNaN(retryAfter)) {
            retryMs = parseInt(retryAfter, 10) * 1000;
          } else {
            // If retry-after is a HTTP date
            try {
              const retryDate = new Date(retryAfter);
              const now = new Date();
              retryMs = retryDate.getTime() - now.getTime();
            } catch (e) {
              retryMs = 5000; // Default to 5 seconds if parsing fails
            }
          }
        } else {
          retryMs = 5000; // Default to 5 seconds if no retry-after header
        }

        // Get endpoint and retry count from error
        const endpoint = error.config?.url || error.detail?.endpoint;
        const retryCount = error.detail?.retryCount || 0;

        showRateLimitNotification(
          error?.message ||
            "Too many requests. Please wait a moment before trying again.",
          retryMs,
          endpoint,
          retryCount
        );

        return true;
      }

      return false;
    },
    [isRateLimitError, showRateLimitNotification]
  );

  // Listen for rate limit events from the API client
  useEffect(() => {
    const handleRateLimitEvent = (event) => {
      const { message, retryAfter, endpoint, retryCount = 0 } = event.detail;
      showRateLimitNotification(message, retryAfter, endpoint, retryCount);
    };

    window.addEventListener(RATE_LIMIT_EVENT, handleRateLimitEvent);

    return () => {
      window.removeEventListener(RATE_LIMIT_EVENT, handleRateLimitEvent);
    };
  }, [showRateLimitNotification]);

  // Context value
  const value = {
    showRateLimitNotification,
    hideRateLimitNotification,
    isRateLimitError,
    handleRateLimitError,
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
      <RateLimitNotification
        isVisible={notification.isVisible}
        message={notification.message}
        retryAfter={notification.retryAfter}
        onClose={hideRateLimitNotification}
      />
    </RateLimitContext.Provider>
  );
};

/**
 * Hook to use rate limit context
 */
export const useRateLimit = () => {
  const context = useContext(RateLimitContext);

  if (!context) {
    throw new Error("useRateLimit must be used within a RateLimitProvider");
  }

  return context;
};
