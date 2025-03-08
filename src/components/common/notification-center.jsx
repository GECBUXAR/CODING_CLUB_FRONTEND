import React from "react";
import { useNotification } from "@/contexts/notification-context";

// Styles for different notification types
const notificationStyles = {
  base: "fixed z-50 p-4 rounded-md shadow-md min-w-[300px] max-w-md transition-all duration-300 flex items-center justify-between",
  success: "bg-green-100 text-green-800 border-l-4 border-green-500",
  error: "bg-red-100 text-red-800 border-l-4 border-red-500",
  warning: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
  info: "bg-blue-100 text-blue-800 border-l-4 border-blue-500",
  positions: {
    topRight: "top-4 right-4",
    topLeft: "top-4 left-4",
    bottomRight: "bottom-4 right-4",
    bottomLeft: "bottom-4 left-4",
  },
};

// Icons for different notification types
const getIcon = (type) => {
  switch (type) {
    case "success":
      return (
        <svg
          className="w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          aria-label="Success icon"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          className="w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          aria-label="Error icon"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "warning":
      return (
        <svg
          className="w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          aria-label="Warning icon"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="w-5 h-5 mr-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          aria-label="Info icon"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 100 2h.01a1 1 0 100-2H10z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};

// Individual notification component
const Notification = ({ id, message, type, onDismiss }) => {
  return (
    <div
      className={`${notificationStyles.base} ${
        notificationStyles[type] || notificationStyles.info
      } ${notificationStyles.positions.topRight}`}
      role="alert"
    >
      <div className="flex items-center">
        {getIcon(type)}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        className="ml-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        onClick={() => onDismiss(id)}
        aria-label="Close notification"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
          aria-label="Close icon"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

// Notification center component that renders all active notifications
const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-center" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
