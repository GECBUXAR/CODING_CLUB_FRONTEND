"use client";

import { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardLayout({ children, currentPage, setCurrentPage }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "members", label: "Members", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <code className="flex h-8 w-8 items-center justify-center rounded-lg border bg-muted">
                CC
              </code>
              <span className="text-lg">Coding Club</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">AD</span>
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@codingclub.com
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold capitalize">
                {currentPage}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
