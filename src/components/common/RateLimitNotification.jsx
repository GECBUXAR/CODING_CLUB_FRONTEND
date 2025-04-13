import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Component to display rate limit notifications
 * Shows a toast notification when API rate limits are hit
 */
const RateLimitNotification = ({
  isVisible,
  message = "Too many requests. Please wait a moment before trying again.",
  retryAfter = null,
  endpoint = null,
  retryCount = 0,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Set up countdown timer when retryAfter changes
  useEffect(() => {
    if (retryAfter && isVisible) {
      const seconds = Math.ceil(retryAfter / 1000);
      setCountdown(seconds);

      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Set up new countdown interval
      const id = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setIntervalId(id);

      // Clean up interval on unmount
      return () => clearInterval(id);
    }
  }, [retryAfter, isVisible]);

  // Clean up interval when component is hidden
  useEffect(() => {
    if (!isVisible && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isVisible, intervalId]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-amber-800">{message}</p>
          {countdown > 0 && (
            <p className="mt-1 text-sm text-amber-700">
              Please try again in {countdown} seconds
            </p>
          )}
          {endpoint && (
            <p className="mt-1 text-xs text-amber-600">
              Endpoint: {endpoint.split("?")[0]}
              {retryCount > 0 && ` (Retry attempt: ${retryCount})`}
            </p>
          )}
        </div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 inline-flex text-amber-500 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default RateLimitNotification;
