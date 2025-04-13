import React from "react";
import { AuthProvider } from "./contexts/optimized-auth-context";
import { NotificationProvider } from "./contexts/optimized-notification-context";
import { RateLimitProvider } from "./contexts/rate-limit-context";
import NotificationCenter from "./components/common/notification-center";
import ApiConnectionWarning from "./components/common/cors-warning";
import AppRoutes from "./routes";
import { Toaster } from "sonner";
const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RateLimitProvider>
          <NotificationCenter />
          <AppRoutes />
          <ApiConnectionWarning />
          <Toaster position="top-right" richColors closeButton />
        </RateLimitProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
