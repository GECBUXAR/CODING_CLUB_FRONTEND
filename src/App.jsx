import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AllEventsPage from "./pages/AllEventsPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminSignup from "./components/AdminSignup.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/events" element={<AllEventsPage />} />

      {/* Admin Routes */}
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
