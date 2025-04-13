import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";
import { API_CONFIG } from "@/config";

/**
 * Enhanced component to display when API connection issues are detected
 * Shows a helpful message with troubleshooting steps and diagnostic information
 */
export default function ApiConnectionWarning() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    serverReachable: null,
    corsEnabled: null,
    authWorking: null,
    lastChecked: null,
  });

  // Function to check API connectivity - memoized with useCallback
  const checkApiConnection = useCallback(async () => {
    setDiagnosticInfo((prev) => ({
      ...prev,
      lastChecked: new Date().toLocaleTimeString(),
    }));

    try {
      // Try to reach the server health endpoint
      const response = await fetch(
        `${API_CONFIG.BASE_URL.replace("/api/v1", "")}/.well-known/version`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          mode: "cors",
        }
      );

      if (response.ok) {
        setDiagnosticInfo((prev) => ({ ...prev, serverReachable: true }));
        // If server is reachable, CORS is working
        setDiagnosticInfo((prev) => ({ ...prev, corsEnabled: true }));
        setVisible(false); // Hide the warning if everything is working
      } else {
        setDiagnosticInfo((prev) => ({
          ...prev,
          serverReachable: true,
          corsEnabled: true,
          authWorking: false,
        }));
        setVisible(true);
      }
    } catch (error) {
      console.error("API connection check failed:", error);
      // Determine if this is a CORS error
      const isCorsError =
        error.message?.includes("CORS") ||
        error.message?.includes("cross-origin");

      setDiagnosticInfo((prev) => ({
        ...prev,
        serverReachable: false,
        corsEnabled: !isCorsError,
        authWorking: false,
      }));
      setVisible(true);
    }
  }, []); // Empty dependency array since this doesn't depend on any props or state

  useEffect(() => {
    // Check connection on component mount
    checkApiConnection();

    // Listen for custom API error events
    const handleApiError = (event) => {
      if (event.detail?.type === "cors") {
        setDiagnosticInfo((prev) => ({ ...prev, corsEnabled: false }));
      } else if (event.detail?.type === "auth") {
        setDiagnosticInfo((prev) => ({ ...prev, authWorking: false }));
      } else {
        setDiagnosticInfo((prev) => ({ ...prev, serverReachable: false }));
      }
      setVisible(true);
    };

    // Handler for CORS-specific errors
    const handleCorsError = () => {
      setDiagnosticInfo((prev) => ({ ...prev, corsEnabled: false }));
      setVisible(true);
    };

    window.addEventListener("api-error", handleApiError);
    window.addEventListener("cors-error", handleCorsError);

    return () => {
      window.removeEventListener("api-error", handleApiError);
      window.removeEventListener("cors-error", handleCorsError);
    };
  }, [checkApiConnection]); // Add checkApiConnection as a dependency

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
                {diagnosticInfo.corsEnabled === false
                  ? "Cross-Origin (CORS) error detected. The server may be rejecting requests from this origin."
                  : diagnosticInfo.serverReachable === false
                  ? "Unable to connect to the backend server. The server may be down or unreachable."
                  : "There was a problem connecting to the API."}
              </p>

              {expanded && (
                <div className="mt-3 text-sm text-orange-700">
                  <p className="font-medium">Diagnostic Information:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>
                      Server reachable:{" "}
                      {diagnosticInfo.serverReachable === null
                        ? "Unknown"
                        : diagnosticInfo.serverReachable
                        ? "Yes ✓"
                        : "No ✗"}
                    </li>
                    <li>
                      CORS configured:{" "}
                      {diagnosticInfo.corsEnabled === null
                        ? "Unknown"
                        : diagnosticInfo.corsEnabled
                        ? "Yes ✓"
                        : "No ✗"}
                    </li>
                    <li>
                      Last checked: {diagnosticInfo.lastChecked || "Never"}
                    </li>
                  </ul>

                  <p className="font-medium mt-3">Troubleshooting steps:</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Ensure the backend server is running</li>
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page</li>
                    <li>Contact support if the issue persists</li>
                  </ol>

                  <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
                    <p className="font-medium">API URL:</p>
                    <code className="text-xs block mt-1 overflow-x-auto">
                      {API_CONFIG.BASE_URL}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={checkApiConnection}
                    className="mt-3 flex items-center text-sm font-medium text-orange-700 hover:text-orange-900"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Run connection test
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-orange-700 hover:text-orange-900 text-sm mt-2 underline"
              >
                {expanded ? "Show less" : "Show diagnostic info"}
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
