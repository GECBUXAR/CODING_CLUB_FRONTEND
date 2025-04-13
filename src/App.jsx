import React from "react";
import { AuthProvider } from "./contexts/optimized-auth-context";
import { NotificationProvider } from "./contexts/optimized-notification-context";
import { ResponseEvaluationProvider } from "./contexts/optimized-response-evaluation-context";
import { ExamProvider } from "./contexts/optimized-exam-context";
import { EventProvider } from "./contexts/optimized-event-context";
import { FacultyProvider } from "./components/faculty/OptimizedFacultyContext";
import NotificationCenter from "./components/common/notification-center";
import ApiConnectionWarning from "./components/common/cors-warning";
import AppRoutes from "./routes";
import { Toaster } from "sonner";

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationCenter />
        <ResponseEvaluationProvider>
          <ExamProvider>
            <EventProvider>
              <FacultyProvider>
                <AppRoutes />
                <ApiConnectionWarning />
                <Toaster position="top-right" richColors closeButton />
              </FacultyProvider>
            </EventProvider>
          </ExamProvider>
        </ResponseEvaluationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
