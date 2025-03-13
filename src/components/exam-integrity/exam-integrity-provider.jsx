import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { FullscreenWarningModal } from "./fullscreen-warning-modal";
import { FocusWarningModal } from "./focus-warning-modal";
import { PrivacyNoticeModal } from "./privacy-notice-modal";
import {
  requestFullscreen,
  getFullscreenElement,
  exitFullscreen,
  getFullscreenChangeEvent,
  preventFullscreenExit,
  monitorWindowFocus,
  disableContextMenu,
  blockNavigationShortcuts,
  isPageVisibilitySupported,
  getVisibilityChangeEvent,
  createHeartbeatChecker,
  detectDevTools,
  detectVirtualization,
  detectScreenSharing,
} from "./browser-utils";

// Import isFullscreenSupported and isPageVisible as named functions to avoid linter errors
import * as BrowserUtils from "./browser-utils";

const ExamIntegrityContext = createContext(undefined);

export function useExamIntegrity() {
  const context = useContext(ExamIntegrityContext);
  if (context === undefined) {
    throw new Error(
      "useExamIntegrity must be used within an ExamIntegrityProvider"
    );
  }
  return context;
}

export function ExamIntegrityProvider({
  children,
  onForceSubmit,
  onIntegrityViolation,
  examId,
  allowAccessibilityExceptions = false,
}) {
  // State for tracking integrity violations
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [focusViolations, setFocusViolations] = useState(0);
  const [fullscreenViolations, setFullscreenViolations] = useState(0);
  const [isIntegrityModeActive, setIsIntegrityModeActive] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [showFocusWarning, setShowFocusWarning] = useState(false);
  const [remainingGraceTime, setRemainingGraceTime] = useState(null);

  // New state for privacy and advanced detection
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [advancedViolations, setAdvancedViolations] = useState(0);
  const [detectedVirtualization, setDetectedVirtualization] = useState(false);
  const [detectedDevTools, setDetectedDevTools] = useState(false);
  const [detectedScreenSharing, setDetectedScreenSharing] = useState(false);
  const [networkStatus, setNetworkStatus] = useState("online");
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);

  // New state for accessibility accommodations
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  // Refs for cleanup functions and DOM elements
  const fullscreenCleanupRef = useRef(null);
  const focusMonitorCleanupRef = useRef(null);
  const contextMenuCleanupRef = useRef(null);
  const shortcutsCleanupRef = useRef(null);
  const examContainerRef = useRef(null);
  const graceTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Heartbeat checker for continuous monitoring
  const heartbeatRef = useRef(null);

  // New refs
  const serverSyncRef = useRef(null);
  const networkMonitorRef = useRef(null);
  const lastServerSync = useRef(Date.now());

  // Memoized functions to avoid dependency issues in useEffect
  const checkFullscreenSupport = useCallback(() => {
    return BrowserUtils.isFullscreenSupported();
  }, []);

  const checkPageVisibility = useCallback(() => {
    return BrowserUtils.isPageVisible();
  }, []);

  // Check if fullscreen is supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullscreenSupported(checkFullscreenSupport());
    }
  }, [checkFullscreenSupport]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!getFullscreenElement();
      setIsFullscreen(isCurrentlyFullscreen);

      if (isIntegrityModeActive && !isCurrentlyFullscreen) {
        setFullscreenViolations((prev) => prev + 1);

        // Try to re-enter fullscreen mode
        if (checkFullscreenSupport()) {
          requestFullscreen(document.documentElement).catch(() => {
            setShowFullscreenWarning(true);
          });
        }
      }
    };

    const fullscreenChangeEvent = getFullscreenChangeEvent();
    document.addEventListener(fullscreenChangeEvent, handleFullscreenChange);

    return () => {
      document.removeEventListener(
        fullscreenChangeEvent,
        handleFullscreenChange
      );
    };
  }, [isIntegrityModeActive, checkFullscreenSupport]);

  // Handle page visibility changes
  useEffect(() => {
    if (!isPageVisibilitySupported()) return;

    const handleVisibilityChange = () => {
      const visible = checkPageVisibility();
      setIsPageVisible(visible);

      if (isIntegrityModeActive && !visible) {
        handleFocusViolation();
      }
    };

    const visibilityEvent = getVisibilityChangeEvent();
    document.addEventListener(visibilityEvent, handleVisibilityChange);

    return () => {
      document.removeEventListener(visibilityEvent, handleVisibilityChange);
    };
  }, [isIntegrityModeActive, checkPageVisibility]);

  // Handle focus violation
  const handleFocusViolation = useCallback(() => {
    setFocusViolations((prev) => prev + 1);
    setShowFocusWarning(true);

    // Start grace period countdown
    const GRACE_PERIOD_SECONDS = 30;
    setRemainingGraceTime(GRACE_PERIOD_SECONDS);

    // Clear any existing grace period
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Set up countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setRemainingGraceTime((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set up force submit timeout after grace period
    graceTimeoutRef.current = setTimeout(() => {
      // Auto submit after grace period
      forceSubmitExam();
    }, GRACE_PERIOD_SECONDS * 1000);
  }, []);

  // Handle fullscreen violation
  const handleFullscreenViolation = useCallback(() => {
    setFullscreenViolations((prev) => prev + 1);

    // Try to re-enter fullscreen mode
    if (checkFullscreenSupport()) {
      requestFullscreen(document.documentElement).catch(() => {
        setShowFullscreenWarning(true);
      });
    }
  }, [checkFullscreenSupport]);

  // Initialize heartbeat checker
  useEffect(() => {
    if (isIntegrityModeActive && !heartbeatRef.current) {
      heartbeatRef.current = createHeartbeatChecker(() => {
        // Check if still in fullscreen mode
        const isCurrentlyFullscreen = !!getFullscreenElement();
        if (!isCurrentlyFullscreen) {
          handleFullscreenViolation();
        }

        // Check if page is visible and window is focused
        if (!checkPageVisibility() || !isWindowFocused) {
          handleFocusViolation();
        }
      }, 15000); // Check every 15 seconds

      heartbeatRef.current.start();
    }

    return () => {
      if (heartbeatRef.current) {
        heartbeatRef.current.stop();
        heartbeatRef.current = null;
      }
    };
  }, [
    isIntegrityModeActive,
    isWindowFocused,
    handleFocusViolation,
    handleFullscreenViolation,
    checkPageVisibility,
  ]);

  // Force submit the exam
  const forceSubmitExam = useCallback(() => {
    if (typeof onForceSubmit === "function") {
      onForceSubmit();
    }
    setIsIntegrityModeActive(false);

    // Exit fullscreen
    if (getFullscreenElement()) {
      exitFullscreen().catch((err) =>
        console.error("Error exiting fullscreen:", err)
      );
    }

    // Clean up event listeners and timers
    if (fullscreenCleanupRef.current) {
      fullscreenCleanupRef.current();
      fullscreenCleanupRef.current = null;
    }

    if (focusMonitorCleanupRef.current) {
      focusMonitorCleanupRef.current();
      focusMonitorCleanupRef.current = null;
    }

    if (contextMenuCleanupRef.current) {
      contextMenuCleanupRef.current();
      contextMenuCleanupRef.current = null;
    }

    if (shortcutsCleanupRef.current) {
      shortcutsCleanupRef.current();
      shortcutsCleanupRef.current = null;
    }

    // Stop heartbeat
    if (heartbeatRef.current) {
      heartbeatRef.current.stop();
    }

    // Clear any active timers
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
      graceTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setRemainingGraceTime(null);
    setShowFocusWarning(false);
    setShowFullscreenWarning(false);
  }, [onForceSubmit]);

  // Activate integrity mode
  const activateIntegrityMode = useCallback(() => {
    if (isIntegrityModeActive) return;

    // Check if user has accessibility requirements
    if (allowAccessibilityExceptions) {
      setAccessibilityMode(true);
    }

    // Only enforce fullscreen if not in accessibility mode
    if (!accessibilityMode) {
      const isSupported = checkFullscreenSupport();
      setFullscreenSupported(isSupported);

      if (isSupported) {
        requestFullscreen(document.documentElement).catch(() => {
          setShowFullscreenWarning(true);
          return;
        });
      } else {
        setShowFullscreenWarning(true);
        return;
      }
    }

    // Server timestamp sync
    syncWithServer();

    // Start monitoring network
    startNetworkMonitoring();

    // Start advanced detection
    startAdvancedDetection();

    // Initialize monitoring
    setupMonitoring();

    setIsIntegrityModeActive(true);
  }, [isIntegrityModeActive, accessibilityMode]);

  // Explicitly request fullscreen - this should be called from a direct user action
  const requestFullscreenMode = useCallback(() => {
    if (checkFullscreenSupport()) {
      // This needs to be called directly from a user action handler
      requestFullscreen(document.documentElement).catch((err) => {
        console.error("Failed to enter fullscreen:", err);
        setShowFullscreenWarning(true);
      });
    }
  }, [checkFullscreenSupport]);

  // Deactivate integrity mode
  const deactivateIntegrityMode = useCallback(() => {
    setIsIntegrityModeActive(false);

    // Exit fullscreen
    if (getFullscreenElement()) {
      exitFullscreen().catch((err) =>
        console.error("Error exiting fullscreen:", err)
      );
    }

    // Clean up event listeners
    if (fullscreenCleanupRef.current) {
      fullscreenCleanupRef.current();
      fullscreenCleanupRef.current = null;
    }

    if (focusMonitorCleanupRef.current) {
      focusMonitorCleanupRef.current();
      focusMonitorCleanupRef.current = null;
    }

    if (contextMenuCleanupRef.current) {
      contextMenuCleanupRef.current();
      contextMenuCleanupRef.current = null;
    }

    if (shortcutsCleanupRef.current) {
      shortcutsCleanupRef.current();
      shortcutsCleanupRef.current = null;
    }

    // Stop heartbeat
    if (heartbeatRef.current) {
      heartbeatRef.current.stop();
    }

    // Clear any active timers
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
      graceTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setRemainingGraceTime(null);
    setShowFocusWarning(false);
    setShowFullscreenWarning(false);
  }, []);

  // Handle retry for fullscreen
  const handleRetryFullscreen = useCallback(() => {
    setShowFullscreenWarning(false);
    requestFullscreenMode();
  }, [requestFullscreenMode]);

  // Handle return to exam after focus warning
  const handleReturnToExam = useCallback(() => {
    // Clear grace period
    if (graceTimeoutRef.current) {
      clearTimeout(graceTimeoutRef.current);
      graceTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setRemainingGraceTime(null);
    setShowFocusWarning(false);

    // Ensure we're in fullscreen
    if (
      isIntegrityModeActive &&
      !getFullscreenElement() &&
      checkFullscreenSupport()
    ) {
      requestFullscreen(document.documentElement).catch(() => {
        setShowFullscreenWarning(true);
      });
    }
  }, [isIntegrityModeActive, checkFullscreenSupport]);

  // New function to start integrity mode with privacy notice first
  const startIntegrityMode = useCallback(() => {
    // Show privacy notice before activating integrity mode
    setShowPrivacyNotice(true);
  }, []);

  // Accept privacy notice and start real integrity checks
  const acceptPrivacyNotice = useCallback(() => {
    setPrivacyAcknowledged(true);
    setShowPrivacyNotice(false);

    // Start actual integrity mode
    activateIntegrityMode();
  }, []);

  // Decline privacy notice
  const declinePrivacyNotice = useCallback(() => {
    setShowPrivacyNotice(false);
    // User declined, so don't start integrity mode
    // You might want to redirect them away from the exam
  }, []);

  // Function to sync with server (timestamp verification)
  const syncWithServer = useCallback(() => {
    // Record last sync time
    lastServerSync.current = Date.now();

    // Report to server that integrity monitoring started
    if (typeof onIntegrityViolation === "function") {
      onIntegrityViolation({
        type: "monitoring_started",
        examId,
        clientTime: Date.now(),
        integrityData: {
          fullscreenSupported,
          accessibilityMode,
          userAgent: navigator.userAgent,
        },
      });
    }

    // Set up regular server syncing
    if (serverSyncRef.current) {
      clearInterval(serverSyncRef.current);
    }

    serverSyncRef.current = setInterval(() => {
      lastServerSync.current = Date.now();

      // Send heartbeat to server with current integrity state
      if (typeof onIntegrityViolation === "function") {
        onIntegrityViolation({
          type: "heartbeat",
          examId,
          clientTime: Date.now(),
          integrityData: {
            focusViolations,
            fullscreenViolations,
            advancedViolations,
            detectedVirtualization,
            detectedDevTools,
            detectedScreenSharing,
            networkStatus,
          },
        });
      }
    }, 30000); // Every 30 seconds
  }, [examId, focusViolations, fullscreenViolations, advancedViolations]);

  // Monitor network connectivity
  const startNetworkMonitoring = useCallback(() => {
    const handleOnline = () => {
      setNetworkStatus("online");

      // Sync with server when connection returns
      syncWithServer();
    };

    const handleOffline = () => {
      setNetworkStatus("offline");

      // Let server know about disconnection when we reconnect
      if (typeof onIntegrityViolation === "function") {
        // Store the event to send when back online
        window.localStorage.setItem(
          "integrity_offline_event",
          JSON.stringify({
            type: "network_disconnection",
            examId,
            clientTime: Date.now(),
          })
        );
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for stored offline events to send
    if (navigator.onLine) {
      const storedEvent = window.localStorage.getItem(
        "integrity_offline_event"
      );
      if (storedEvent && typeof onIntegrityViolation === "function") {
        try {
          const eventData = JSON.parse(storedEvent);
          onIntegrityViolation({
            ...eventData,
            reconnectedAt: Date.now(),
          });
          window.localStorage.removeItem("integrity_offline_event");
        } catch (e) {
          console.error("Error processing stored offline event", e);
        }
      }
    }

    networkMonitorRef.current = () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [examId]);

  // Start advanced detection mechanisms
  const startAdvancedDetection = useCallback(() => {
    let advancedDetectionInterval;

    const checkAdvancedViolations = async () => {
      // Check for virtual machines
      const virtualization = detectVirtualization();
      if (virtualization.hasVirtualizationIndicators) {
        setDetectedVirtualization(true);
        handleAdvancedViolation("virtualization", virtualization.indicators);
      }

      // Check for developer tools
      const devToolsOpen = detectDevTools();
      if (devToolsOpen) {
        setDetectedDevTools(true);
        handleAdvancedViolation("devtools");
      }

      // Check for screen sharing
      const isScreenSharing = await detectScreenSharing();
      if (isScreenSharing) {
        setDetectedScreenSharing(true);
        handleAdvancedViolation("screensharing");
      }
    };

    // Initial check
    checkAdvancedViolations();

    // Set up interval for continued checking
    advancedDetectionInterval = setInterval(checkAdvancedViolations, 60000); // Every minute

    return () => {
      clearInterval(advancedDetectionInterval);
    };
  }, []);

  // Handle advanced integrity violations
  const handleAdvancedViolation = useCallback(
    (violationType, details = {}) => {
      setAdvancedViolations((prev) => prev + 1);

      // Report to server
      if (typeof onIntegrityViolation === "function") {
        onIntegrityViolation({
          type: "advanced_violation",
          violationType,
          examId,
          clientTime: Date.now(),
          details,
        });
      }
    },
    [examId]
  );

  // Cleanup on unmount - add new refs to cleanup
  useEffect(() => {
    return () => {
      if (serverSyncRef.current) {
        clearInterval(serverSyncRef.current);
        serverSyncRef.current = null;
      }

      if (networkMonitorRef.current) {
        networkMonitorRef.current();
        networkMonitorRef.current = null;
      }

      // ... existing cleanup ...
    };
  }, []);

  // Value to be provided by the context
  const value = {
    // Existing state and functions
    isIntegrityModeActive,
    isFullscreen,
    isPageVisible,
    isWindowFocused,
    focusViolations,
    fullscreenViolations,
    isFullscreenSupported: fullscreenSupported,
    enterFullscreen: activateIntegrityMode, // Old function name for compatibility
    exitIntegrityMode: deactivateIntegrityMode,

    // New state and functions
    advancedViolations,
    detectedVirtualization,
    detectedDevTools,
    detectedScreenSharing,
    networkStatus,
    accessibilityMode,
    startIntegrityMode, // New public function
    setAccessibilityMode,
  };

  return (
    <ExamIntegrityContext.Provider value={value}>
      {showFullscreenWarning && (
        <FullscreenWarningModal
          isOpen={showFullscreenWarning}
          onClose={() => setShowFullscreenWarning(false)}
          isSupported={fullscreenSupported}
          onRetry={activateIntegrityMode}
        />
      )}
      {showFocusWarning && (
        <FocusWarningModal
          isOpen={showFocusWarning}
          remainingTime={remainingGraceTime}
          onReturn={handleReturnToExam}
        />
      )}

      {showPrivacyNotice && (
        <PrivacyNoticeModal
          isOpen={showPrivacyNotice}
          onAccept={acceptPrivacyNotice}
          onDecline={declinePrivacyNotice}
          accessibilityEnabled={allowAccessibilityExceptions}
        />
      )}

      {children}
    </ExamIntegrityContext.Provider>
  );
}
