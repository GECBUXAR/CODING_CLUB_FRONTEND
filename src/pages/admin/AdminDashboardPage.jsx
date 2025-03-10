"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/admin/dashboard-layout";
import DashboardOverview from "@/components/admin/dashboard-overview";
import { EventsPage } from "@/components/admin/events-page";
import { FacultyPage } from "@/components/admin/faculty-page";
import { SettingsPage } from "@/components/admin/settings-page";
import { AdminExamPanel } from "./AdminExamPanel";

export default function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === "dashboard" && <DashboardOverview />}
      {currentPage === "events" && <EventsPage />}
      {currentPage === "admin-exams" && <AdminExamPanel />}
      {currentPage === "faculty" && <FacultyPage />}
      {currentPage === "settings" && <SettingsPage />}
    </DashboardLayout>
  );
}
