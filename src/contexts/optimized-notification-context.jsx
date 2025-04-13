import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

// Create notification contexts
const NotificationStateContext = createContext(null);
const NotificationActionsContext = createContext(null);

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Default notification duration
const DEFAULT_DURATION = 5000; // 5 seconds

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a notification - memoized to prevent unnecessary re-renders
  const addNotification = useCallback(
    (type, message, duration = DEFAULT_DURATION) => {
      const id = uuidv4();
      const notification = {
        id,
        type,
        message,
        duration,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto remove notification after duration
      if (duration !== 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  // Remove a notification by ID - memoized
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Helper methods for different types of notifications - all memoized
  const success = useCallback(
    (message, duration) =>
      addNotification(NOTIFICATION_TYPES.SUCCESS, message, duration),
    [addNotification]
  );

  const error = useCallback(
    (message, duration) =>
      addNotification(NOTIFICATION_TYPES.ERROR, message, duration),
    [addNotification]
  );

  const warning = useCallback(
    (message, duration) =>
      addNotification(NOTIFICATION_TYPES.WARNING, message, duration),
    [addNotification]
  );

  const info = useCallback(
    (message, duration) =>
      addNotification(NOTIFICATION_TYPES.INFO, message, duration),
    [addNotification]
  );

  // Clear all notifications - memoized
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Memoize the state value to prevent unnecessary re-renders
  const stateValue = useMemo(() => ({ notifications }), [notifications]);

  // Memoize the actions value to prevent unnecessary re-renders
  const actionsValue = useMemo(
    () => ({
      addNotification,
      removeNotification,
      success,
      error,
      warning,
      info,
      clearAll,
    }),
    [
      addNotification,
      removeNotification,
      success,
      error,
      warning,
      info,
      clearAll,
    ]
  );

  return (
    <NotificationStateContext.Provider value={stateValue}>
      <NotificationActionsContext.Provider value={actionsValue}>
        {children}
      </NotificationActionsContext.Provider>
    </NotificationStateContext.Provider>
  );
};

// Custom hooks to use notification context
export const useNotificationState = () => {
  const context = useContext(NotificationStateContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useNotificationState must be used within a NotificationProvider"
    );
  }
  return context;
};

export const useNotificationActions = () => {
  const context = useContext(NotificationActionsContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useNotificationActions must be used within a NotificationProvider"
    );
  }
  return context;
};

// Combined hook for backward compatibility
export const useNotification = () => {
  const state = useNotificationState();
  const actions = useNotificationActions();
  
  return { ...state, ...actions };
};
