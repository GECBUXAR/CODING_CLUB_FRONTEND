import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/contexts/optimized-auth-context";
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
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserDashboardLayout({ children, currentPage, setCurrentPage }) {
  const [isMobile, setIsMobile] = useState(false);
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const user = state?.user || {
    name: "User",
    email: "user@example.com",
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

  useEffect(() => {
    // If not authenticated after state is loaded, redirect to login
    if (state && !state.isAuthenticated) {
      navigate("/login");
    }
  }, [state, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "exams", label: "My Exams", icon: GraduationCap },
    { id: "events", label: "My Events", icon: Calendar },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full ">
        <Sidebar className="border-r">
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-1 sm:gap-2 font-semibold">
              <code className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg border bg-muted">
                <img
                  className="object-cover size-5 sm:size-7"
                  src="/image/CodingClubLogoSmall.png"
                  alt="Coding Club Logo"
                />
              </code>
              <span className="text-base sm:text-lg">
                <img
                  src="/image/CodingClubLogo.png"
                  alt="Coding Club"
                  className="w-24 sm:w-30"
                />
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className="text-xs sm:text-sm py-1.5 sm:py-2"
                  >
                    <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  className="w-full justify-start p-1.5 sm:p-2 px-2 sm:px-3 -ml-2 hover:bg-primary/5 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                        {user.name?.substring(0, 2) || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px]">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 sm:w-56 text-xs sm:text-sm"
              >
                <DropdownMenuLabel className="text-xs sm:text-sm">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2"
                  onClick={() => setCurrentPage("settings")}
                >
                  <User className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2"
                  onClick={() => setCurrentPage("settings")}
                >
                  <Settings className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 text-xs sm:text-sm py-1.5 sm:py-2"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-12 sm:h-14 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6">
            <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
            <div className="flex-1">
              <h1 className="text-base sm:text-lg font-semibold capitalize">
                {currentPage === "dashboard"
                  ? "Dashboard"
                  : currentPage === "exams"
                  ? "My Exams"
                  : currentPage === "events"
                  ? "My Events"
                  : currentPage === "resources"
                  ? "Learning Resources"
                  : currentPage === "achievements"
                  ? "Achievements"
                  : currentPage === "profile"
                  ? "User Profile"
                  : "Settings"}
              </h1>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 max-w-full">
            <div className="mx-auto max-w-7xl w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
