import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, XCircle } from "lucide-react";

const CorsWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Listen for CORS errors
  useEffect(() => {
    const handleError = (event) => {
      const error = event.reason || event.error || event;
      const errorString =
        error?.message || error?.toString() || event?.message || "";

      // Specific detection for credential CORS errors
      if (
        errorString.includes("CORS") ||
        errorString.includes("cross-origin") ||
        errorString.includes("Cross-Origin") ||
        errorString.includes("Credential is not supported")
      ) {
        setErrorCount((prev) => prev + 1);
        setShowWarning(true);
      }
    };

    window.addEventListener("unhandledrejection", handleError);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleError);
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Don't render anything if no CORS errors
  if (!showWarning) return null;

  return (
    <Alert
      variant="destructive"
      className="fixed bottom-4 right-4 w-96 shadow-lg z-50"
    >
      <AlertTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <XCircle className="h-4 w-4" /> CORS Connection Issue
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setShowWarning(false)}
        >
          ×
        </Button>
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Unable to connect to the server due to a CORS credentials issue. This
          app is using a third-party CORS proxy which doesn't support
          credentials with wildcard origins.
        </p>
        <div className="flex space-x-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                "https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf",
                "_blank"
              )
            }
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Get CORS Extension
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CorsWarning;
