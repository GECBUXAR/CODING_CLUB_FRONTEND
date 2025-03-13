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

/**
 * Utility functions for detecting advanced techniques that might compromise exam integrity
 */

/**
 * Detect if screen sharing is active
 * Uses the Screen Capture API to detect if the screen is being shared
 * @returns {Promise<boolean>}
 */
export async function detectScreenSharing() {
  try {
    // Check if the Screen Capture API is available
    if (typeof navigator.mediaDevices?.getDisplayMedia === "undefined") {
      return false;
    }

    // Use the Screen Detector API if available
    if (typeof navigator.mediaDevices?.getDisplayMedia === "function") {
      // Modern approach using mediaDevices
      const mediaDevices = navigator.mediaDevices;

      if (typeof mediaDevices.getDisplayMedia === "function") {
        // Try to detect active screen captures - throws error if not sharing
        const streams = await mediaDevices.getDisplayMedia({
          video: true,
          preferCurrentTab: false,
        });
        if (streams) {
          // Clean up the test stream
          streams.getTracks().forEach((track) => track.stop());
          // If we got here, screen sharing might be active
          return false; // We return false because this check is not reliable for detecting others' recording
        }
      }
    }

    return false;
  } catch (error) {
    // Error accessing screen sharing API
    return false;
  }
}

/**
 * Detect if DevTools are open
 * @returns {boolean}
 */
export function detectDevTools() {
  // Size-based detection
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  // Check if devtools is likely open based on window dimensions
  const sizeBasedDetection = widthThreshold || heightThreshold;

  // Timing-based detection (slower console methods when devtools is open)
  const timeStart = performance.now();
  console.debug("DevTools Detection"); // This operation is slower with devtools open
  const timeEnd = performance.now();
  const timingBasedDetection = timeEnd - timeStart > 10; // More than 10ms suggests devtools

  return sizeBasedDetection || timingBasedDetection;
}

/**
 * Detect signs of virtualization or emulation
 * Note: This is not 100% reliable but can detect some VMs
 * @returns {object} Details about detected virtualization
 */
export function detectVirtualization() {
  const indicators = {
    hasVmHardware: false,
    hasEmulatedGPU: false,
    hasLowCpuCores: false,
    hasUnusualUserAgent: false,
  };

  // Check hardware concurrency (VMs often have few cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
    indicators.hasLowCpuCores = true;
  }

  // Check for emulated GPU renderer
  if (typeof WebGLRenderingContext !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        // Try to get renderer info, first with standard approach
        let renderer = "";
        try {
          renderer = gl.getParameter(gl.RENDERER).toLowerCase();
        } catch (e) {
          // Fall back to debug extension if needed
          try {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
              renderer = gl
                .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                .toLowerCase();
            }
          } catch (e2) {
            // Unable to get renderer info
            console.log("Unable to retrieve WebGL renderer information");
          }
        }

        // Check for common VM GPU names
        if (
          renderer &&
          (renderer.includes("virtualbox") ||
            renderer.includes("vmware") ||
            renderer.includes("llvmpipe") ||
            renderer.includes("swiftshader") ||
            renderer.includes("virgl"))
        ) {
          indicators.hasEmulatedGPU = true;
        }
      }
    } catch (e) {
      // WebGL not available or error accessing
    }
  }

  // Check user agent for VM indicators (less reliable)
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("virtualbox") || userAgent.includes("vmware")) {
    indicators.hasUnusualUserAgent = true;
  }

  return {
    indicators,
    hasVirtualizationIndicators: Object.values(indicators).some(Boolean),
  };
}

/**
 * Sets up basic monitoring for the exam integrity system
 * This consolidates various monitoring functions
 */
export function setupMonitoring() {
  console.log("Setting up basic integrity monitoring");

  // Listen for visibility changes
  if (isPageVisibilitySupported()) {
    const visibilityEvent = getVisibilityChangeEvent();
    document.addEventListener(visibilityEvent, () => {
      const isVisible = isPageVisible();
      if (!isVisible) {
        console.log("Document visibility changed to hidden");
        // Can dispatch event or call callback here
      }
    });
  }

  // Set up any other basic monitoring as needed
  detectDevTools();
}
