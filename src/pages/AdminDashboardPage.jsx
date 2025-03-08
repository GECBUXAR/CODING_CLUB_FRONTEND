"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/admin/dashboard-layout";
import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { EventsPage } from "@/components/admin/events-page";
import { AdminExamPanel } from "@/components/admin/admin-exam-panel";
import { MembersPage } from "@/components/admin/members-page";
import { SettingsPage } from "@/components/admin/settings-page";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === "dashboard" && <DashboardOverview />}
      {currentPage === "events" && <EventsPage />}
      {currentPage === "admin-exams" && <AdminExamPanel />}
      {currentPage === "members" && <MembersPage />}
      {currentPage === "settings" && <SettingsPage />}
    </DashboardLayout>
  );
}
