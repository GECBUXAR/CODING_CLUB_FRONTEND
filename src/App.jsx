import React from "react";
import { AuthProvider } from "./contexts/auth-context";
import { NotificationProvider } from "./contexts/notification-context";
import { ResponseEvaluationProvider } from "./contexts/response-evaluation-context";
import { ExamProvider } from "./contexts/exam-context";
import { FacultyProvider } from "./contexts/faculty-context";
import NotificationCenter from "./components/common/notification-center";
import CorsWarning from "./components/common/cors-warning";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationCenter />
        <ResponseEvaluationProvider>
          <ExamProvider>
            <FacultyProvider>
              <AppRoutes />
              <CorsWarning />
            </FacultyProvider>
          </ExamProvider>
        </ResponseEvaluationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
