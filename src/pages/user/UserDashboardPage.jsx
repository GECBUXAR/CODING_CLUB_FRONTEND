import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserDashboardLayout } from "@/components/user/dashboard-layout";
// import { ExamSection } from "@/components/user/exam-section";
import { UserExamPanel } from "@/components/user/user-exam-panel";
import { EventSection } from "@/components/user/event-section";
import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  GraduationCapIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "lucide-react";

// Dashboard overview component
const DashboardOverview = ({ setCurrentPage }) => {
  const { state } = useAuth();
  const user = state?.user || {
    name: "User",
    email: "user@example.com",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            Welcome back, {user?.name || "User"}!
          </CardTitle>
          <CardDescription className="text-blue-100">
            Here's what's happening with your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white">
          <div className="text-sm">
            Member since{" "}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">3</div>
              <GraduationCapIcon className="h-6 w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="#" onClick={() => setCurrentPage("exams")}>
                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2</div>
              <CalendarIcon className="h-6 w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="#" onClick={() => setCurrentPage("events")}>
                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">42</div>
              <BookOpenIcon className="h-6 w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="#" onClick={() => setCurrentPage("resources")}>
                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">7</div>
              <TrophyIcon className="h-6 w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="#" onClick={() => setCurrentPage("achievements")}>
                View All <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Access to Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Exams</CardTitle>
          <CardDescription>Continue where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  JavaScript Fundamentals
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  Progress: 60%
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-[60%] rounded-full bg-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Continue
                </Button>
              </CardFooter>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  React Advanced Concepts
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  Not started yet
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-full w-0 rounded-full bg-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const UserDashboardPage = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview setCurrentPage={setCurrentPage} />;
      case "exams":
        return <UserExamPanel />;
      case "events":
        return <EventSection />;
      case "profile":
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                View and edit your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Profile content will go here</p>
            </CardContent>
          </Card>
        );
      case "resources":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Access tutorials, exercises, and materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Resources content will go here</p>
            </CardContent>
          </Card>
        );
      case "achievements":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your progress and awards</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Achievements content will go here</p>
            </CardContent>
          </Card>
        );
      case "settings":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your preferences and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Settings content will go here</p>
            </CardContent>
          </Card>
        );
      default:
        return <DashboardOverview setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <UserDashboardLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
      {renderContent()}
    </UserDashboardLayout>
  );
};

export default UserDashboardPage;
