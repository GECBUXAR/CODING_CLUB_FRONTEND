"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard-overview";
import { EventsPage } from "@/components/events-page";
import { AdminExamPanel } from "@/components/admin-exam-panel";
// import { MembersPage } from "@/components/members-page"
// import { SettingsPage } from "@/components/settings-page"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === "dashboard" && <DashboardOverview />}
      {currentPage === "events" && <EventsPage />}
      {currentPage === "admin-exams" && <AdminExamPanel />}
      {/* {currentPage === "members" && <MembersPage />} */}
      {/* {currentPage === "settings" && <SettingsPage />} */}
    </DashboardLayout>
  );
}
