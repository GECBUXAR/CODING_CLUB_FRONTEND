"use client";

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

export function ExamIntegrityProvider({ children, onForceSubmit }) {
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

    setIsIntegrityModeActive(true);
    setFocusViolations(0);
    setFullscreenViolations(0);

    // We don't automatically request fullscreen here anymore
    // Instead, we'll show the fullscreen warning which has a button to trigger it
    if (checkFullscreenSupport()) {
      setShowFullscreenWarning(true);
    } else {
      setShowFullscreenWarning(true);
    }

    // Set up preventions
    fullscreenCleanupRef.current = preventFullscreenExit(true);
    focusMonitorCleanupRef.current = monitorWindowFocus(
      () => setIsWindowFocused(false),
      () => setIsWindowFocused(true)
    );
    contextMenuCleanupRef.current = disableContextMenu(true);
    shortcutsCleanupRef.current = blockNavigationShortcuts(true);

    // Start heartbeat
    if (heartbeatRef.current) {
      heartbeatRef.current.start();
    }
  }, [isIntegrityModeActive, checkFullscreenSupport]);

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

  return (
    <ExamIntegrityContext.Provider
      value={{
        isIntegrityModeActive,
        isFullscreen,
        isPageVisible,
        isWindowFocused,
        focusViolations,
        fullscreenViolations,
        activateIntegrityMode,
        deactivateIntegrityMode,
        requestFullscreenMode,
        examContainerRef,
        isFullscreenSupported: checkFullscreenSupport(),
      }}
    >
      {children}

      <FullscreenWarningModal
        isOpen={showFullscreenWarning}
        onClose={() => setShowFullscreenWarning(false)}
        isSupported={checkFullscreenSupport()}
        onRetry={handleRetryFullscreen}
      />

      <FocusWarningModal
        isOpen={showFocusWarning}
        remainingTime={remainingGraceTime}
        onReturn={handleReturnToExam}
      />
    </ExamIntegrityContext.Provider>
  );
}
