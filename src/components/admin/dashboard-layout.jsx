import { useState, useEffect } from "react";
import {
  Calendar,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  Search,
  HelpCircle,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/optimized-auth-context";
import { useNavigate } from "react-router-dom";

export function DashboardLayout({ children, currentPage, setCurrentPage }) {
  const [isMobile, setIsMobile] = useState(false);
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  // Add null check for state before accessing user property
  const user = state?.user || {
    name: "Admin User",
    email: "admin@codingclub.com",
  };

  // Track active status for each nav item
  const isActive = (id) => {
    if (currentPage === id) return true;
    // Special case for nested pages
    if (id === "events" && currentPage?.startsWith("event-")) return true;
    if (id === "admin-exams" && currentPage?.startsWith("exam-")) return true;
    if (id === "faculty" && currentPage?.startsWith("faculty-")) return true;
    return false;
  };

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "admin-exams", label: "Exams", icon: FileText },
    { id: "faculty", label: "Faculty", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r bg-primary-foreground">
          <SidebarHeader className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <img
                  className="object-cover h-7 w-7"
                  src="/image/CodingClubLogoSmall.png"
                  alt="Coding Club Logo"
                />
              </div>
              <span className="text-lg font-bold">
                <span className="hidden lg:block">Coding Club Admin</span>
                <span className="lg:hidden">CC Admin</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <div className="py-4">
              <Badge
                variant="outline"
                className="w-full justify-center py-1 text-xs font-normal bg-primary/5 border-primary/10"
              >
                Administrator Portal
              </Badge>
            </div>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive(item.id)}
                    onClick={() => setCurrentPage(item.id)}
                    className={`${
                      isActive(item.id)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5"
                    } transition-colors`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.id)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 px-3 -ml-2 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name?.substring(0, 2) || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium truncate max-w-[120px]">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setCurrentPage("settings")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setCurrentPage("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 relative ">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">
                {currentPage === "dashboard" && "Dashboard"}
                {currentPage === "admin-exams" && "Exam Management"}
                {currentPage === "events" && "Event Management"}
                {currentPage === "faculty" && "Faculty Management"}
                {currentPage === "settings" && "Settings"}
                {currentPage?.startsWith("event-") && "Event Details"}
                {currentPage?.startsWith("exam-") && "Exam Details"}
                {currentPage?.startsWith("faculty-") && "Faculty Details"}
              </h1>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 pl-8 bg-background"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
              {children}
            </div>
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground bg-muted/30">
            <p>
              © {new Date().getFullYear()} Coding Club. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
