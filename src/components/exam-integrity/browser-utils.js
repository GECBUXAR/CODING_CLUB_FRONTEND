/**
 * Utility functions for browser compatibility and feature detection
 */

// Define vendor-prefixed property names as constants
const MS_HIDDEN = "msHidden";
const WEBKIT_HIDDEN = "webkitHidden";
const WEBKIT_FULLSCREEN_ENABLED = "webkitFullscreenEnabled";
const MOZ_FULLSCREEN_ENABLED = "mozFullScreenEnabled";
const MS_FULLSCREEN_ENABLED = "msFullscreenEnabled";
const WEBKIT_EXIT_FULLSCREEN = "webkitExitFullscreen";
const MOZ_CANCEL_FULLSCREEN = "mozCancelFullScreen";
const MS_EXIT_FULLSCREEN = "msExitFullscreen";
const WEBKIT_FULLSCREEN_ELEMENT = "webkitFullscreenElement";
const MOZ_FULLSCREEN_ELEMENT = "mozFullScreenElement";
const MS_FULLSCREEN_ELEMENT = "msFullscreenElement";

/**
 * Create an untyped document reference to avoid TypeScript errors
 * with vendor-prefixed properties
 * @type {any}
 */
const doc = document;

// Check if the browser supports the Page Visibility API
export function isPageVisibilitySupported() {
  return (
    typeof document !== "undefined" &&
    (typeof document.hidden !== "undefined" ||
      typeof doc[MS_HIDDEN] !== "undefined" ||
      typeof doc[WEBKIT_HIDDEN] !== "undefined")
  );
}

// Get the correct visibility change event name based on browser
export function getVisibilityChangeEvent() {
  if (typeof document === "undefined") return "visibilitychange";

  if (typeof document.hidden !== "undefined") {
    return "visibilitychange";
  }

  if (typeof doc[MS_HIDDEN] !== "undefined") {
    return "msvisibilitychange";
  }

  if (typeof doc[WEBKIT_HIDDEN] !== "undefined") {
    return "webkitvisibilitychange";
  }

  return "visibilitychange";
}

// Check if the page is currently visible
export function isPageVisible() {
  if (typeof document === "undefined") return true;

  if (typeof document.hidden !== "undefined") {
    return !document.hidden;
  }

  if (typeof doc[MS_HIDDEN] !== "undefined") {
    return !doc[MS_HIDDEN];
  }

  if (typeof doc[WEBKIT_HIDDEN] !== "undefined") {
    return !doc[WEBKIT_HIDDEN];
  }

  return true;
}

// Check if the browser supports the Fullscreen API
export function isFullscreenSupported() {
  if (typeof document === "undefined") return false;

  return !!(
    doc.fullscreenEnabled ||
    doc[WEBKIT_FULLSCREEN_ENABLED] ||
    doc[MOZ_FULLSCREEN_ENABLED] ||
    doc[MS_FULLSCREEN_ENABLED]
  );
}

// Request fullscreen on an element with cross-browser support
export function requestFullscreen(element) {
  if (!element) return Promise.reject(new Error("No element provided"));

  if (element.requestFullscreen) {
    return element.requestFullscreen();
  }

  if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  }

  if (element.mozRequestFullScreen) {
    return element.mozRequestFullScreen();
  }

  if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }

  return Promise.reject(new Error("Fullscreen API not supported"));
}

// Exit fullscreen with cross-browser support
export function exitFullscreen() {
  if (typeof document === "undefined")
    return Promise.reject(new Error("Document not available"));

  if (doc.exitFullscreen) {
    return doc.exitFullscreen();
  }

  if (doc[WEBKIT_EXIT_FULLSCREEN]) {
    return doc[WEBKIT_EXIT_FULLSCREEN]();
  }

  if (doc[MOZ_CANCEL_FULLSCREEN]) {
    return doc[MOZ_CANCEL_FULLSCREEN]();
  }

  if (doc[MS_EXIT_FULLSCREEN]) {
    return doc[MS_EXIT_FULLSCREEN]();
  }

  return Promise.reject(new Error("Fullscreen API not supported"));
}

// Get the current fullscreen element
export function getFullscreenElement() {
  if (typeof document === "undefined") return null;

  return (
    doc.fullscreenElement ||
    doc[WEBKIT_FULLSCREEN_ELEMENT] ||
    doc[MOZ_FULLSCREEN_ELEMENT] ||
    doc[MS_FULLSCREEN_ELEMENT] ||
    null
  );
}

/**
 * Get the correct fullscreen change event based on browser
 * @returns {string} The fullscreen change event name
 */
export function getFullscreenChangeEvent() {
  if (typeof document === "undefined") return "fullscreenchange";

  if ("onfullscreenchange" in document) {
    return "fullscreenchange";
  }

  if ("onwebkitfullscreenchange" in document) {
    return "webkitfullscreenchange";
  }

  if ("onmozfullscreenchange" in document) {
    return "mozfullscreenchange";
  }

  if ("onMSFullscreenChange" in document) {
    return "MSFullscreenChange";
  }

  return "fullscreenchange";
}

/**
 * Set up keyboard event listeners to prevent exiting fullscreen
 * @param {boolean} active Whether to activate or deactivate the listeners
 * @returns {Function} Cleanup function to remove event listeners
 */
export function preventFullscreenExit(active) {
  if (typeof document === "undefined") return () => {};

  const handleKeyDown = (e) => {
    // Prevent Escape key
    if (e.key === "Escape" || e.keyCode === 27) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    // Prevent F11 key
    if (e.key === "F11" || e.keyCode === 122) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  };

  if (active) {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }

  return () => {};
}

/**
 * Set up window blur detection
 * @param {Function} onBlur Callback function when window loses focus
 * @param {Function} onFocus Callback function when window gains focus
 * @returns {Function} Cleanup function to remove event listeners
 */
export function monitorWindowFocus(onBlur, onFocus) {
  if (typeof window === "undefined") return () => {};

  const handleBlur = () => {
    if (typeof onBlur === "function") onBlur();
  };

  const handleFocus = () => {
    if (typeof onFocus === "function") onFocus();
  };

  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
  };
}

/**
 * Disable right-click context menu
 * @param {boolean} disable Whether to disable or enable the context menu
 * @returns {Function} Cleanup function to remove event listener
 */
export function disableContextMenu(disable) {
  if (typeof document === "undefined") return () => {};

  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  if (disable) {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }

  return () => {};
}

/**
 * Block common keyboard shortcuts that could be used to navigate away
 * @param {boolean} block Whether to block or allow keyboard shortcuts
 * @returns {Function} Cleanup function to remove event listener
 */
export function blockNavigationShortcuts(block) {
  if (typeof document === "undefined") return () => {};

  const handleKeyDown = (e) => {
    // Block Alt+Tab, Ctrl+Tab
    if (
      (e.altKey && e.key === "Tab") ||
      (e.ctrlKey && e.key === "Tab") ||
      (e.metaKey && e.key === "Tab")
    ) {
      e.preventDefault();
      return false;
    }

    // Block Alt+F4
    if (e.altKey && e.key === "F4") {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+W, Cmd+W (close window)
    if ((e.ctrlKey || e.metaKey) && e.key === "w") {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+N, Cmd+N (new window)
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+Tab, Cmd+Shift+Tab (switch tabs)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      return false;
    }
  };

  if (block) {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }

  return () => {};
}

/**
 * Set up a heartbeat checker to monitor activity
 * @param {Function} callback Function to call on each heartbeat
 * @param {number} interval Interval in milliseconds between heartbeats (default: 15000)
 * @returns {Object} Object containing start and stop functions
 */
export function createHeartbeatChecker(callback, interval = 15000) {
  let intervalId = null;

  const start = () => {
    if (intervalId) return;

    // Call immediately
    if (typeof callback === "function") callback();

    // Then set up interval
    intervalId = setInterval(() => {
      if (typeof callback === "function") callback();
    }, interval);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
}
