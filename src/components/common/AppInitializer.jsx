import React, { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/optimized-auth-context";
import { initializeApiManager } from "@/services/apiManager";

/**
 * AppInitializer component
 *
 * This component handles the initial data loading for the application in a controlled way.
 * It staggers API requests to prevent rate limiting and ensures critical data is loaded first.
 */
const AppInitializer = () => {
  const { state: authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated || false;
  const initializationDone = useRef(false);

  // Handle initial data loading
  useEffect(() => {
    // Skip if already initialized
    if (initializationDone.current) {
      return;
    }

    // Mark as initialized to prevent multiple initializations
    initializationDone.current = true;

    // Delay initialization to allow the app to render first
    const timer = setTimeout(() => {
      // Initialize the API manager
      // This will load critical endpoints first, then common endpoints
      initializeApiManager().catch((error) => {
        console.error("Error initializing API manager:", error);
      });

      console.log("App initialization started");
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default AppInitializer;
