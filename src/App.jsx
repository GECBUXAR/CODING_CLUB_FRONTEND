import React from "react";
import AppRoutes from "./simple-routes";

// Temporarily simplified App component to diagnose blank screen issue
const App = () => {
  return (
    <div className="app-container">
      <h1>Coding Club App</h1>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
};

export default App;
