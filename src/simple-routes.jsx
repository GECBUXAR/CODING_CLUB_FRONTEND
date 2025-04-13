import React from "react";
import { Routes, Route } from "react-router-dom";

// Simple test component
const TestComponent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Test Component</h2>
    <p>This is a test component to diagnose the blank screen issue.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<TestComponent />} />
    </Routes>
  );
};

export default AppRoutes;
