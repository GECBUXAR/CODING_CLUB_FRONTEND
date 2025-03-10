import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Component to display when CORS errors are detected
 * Shows a helpful message with troubleshooting steps
 */
export default function CorsWarning() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Check if we're in development mode where CORS issues are most common
    const isDevelopment = window.location.hostname === "localhost";

    // Only show the warning in development by default
    if (isDevelopment) {
      setVisible(true);
    }

    // Listen for custom CORS error events from API client
    const handleCorsError = () => {
      setVisible(true);
    };

    window.addEventListener("cors-error", handleCorsError);

    return () => {
      window.removeEventListener("cors-error", handleCorsError);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-orange-50 border border-orange-300 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">
                API Connection Issue
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Unable to connect to the backend server. This may be a CORS
                issue.
              </p>

              {expanded && (
                <div className="mt-3 text-sm text-orange-700">
                  <p className="font-medium">Troubleshooting steps:</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Ensure the backend server is running</li>
                    <li>
                      Check that CORS is configured properly on the backend
                    </li>
                    <li>Try using the Vite proxy (restart may be required)</li>
                    <li>
                      Temporarily disable browser CORS protections (for testing
                      only)
                    </li>
                  </ol>

                  <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
                    <p className="font-medium">Server URL:</p>
                    <code className="text-xs block mt-1 overflow-x-auto">
                      {/* @ts-ignore - Vite specific environment variable */}
                      {import.meta.env?.BACKEND_URL || "Not available"}
                    </code>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-orange-700 hover:text-orange-900 text-sm mt-2 underline"
              >
                {expanded ? "Show less" : "Learn more"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-orange-400 hover:text-orange-600"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}
