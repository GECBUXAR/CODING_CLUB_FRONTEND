import { createContext, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// Create notification context
export const NotificationContext = createContext(null);

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

  // Add a notification
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

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Helper methods for different types of notifications
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

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Value to be provided through context
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
