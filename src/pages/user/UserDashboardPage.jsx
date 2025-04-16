import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserDashboardLayout } from "@/components/user/dashboard-layout";
import { UserExamPanel } from "@/components/user/user-exam-panel";
import { EventSection } from "@/components/user/event-section";
import { useAuth } from "@/contexts/optimized-auth-context";
import { eventService, examService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  BookOpenIcon,
  GraduationCapIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowRightIcon,
  AlertCircleIcon,
} from "lucide-react";

// Dashboard overview component
const DashboardOverview = ({ setCurrentPage }) => {
  const { state } = useAuth();
  const user = state?.user || {
    name: "User",
    email: "user@example.com",
  };

  const [stats, setStats] = useState({
    activeExams: 0,
    upcomingEvents: 0,
    resources: 0,
    achievements: 0,
  });

  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user's exams
        const examsResponse = await examService.getUserExams();

        // Fetch user's events
        const eventsResponse = await eventService.getUserEvents();

        if (examsResponse.success && eventsResponse.success) {
          // Set stats
          setStats({
            activeExams: examsResponse.data.length || 0,
            upcomingEvents:
              eventsResponse.data.filter(
                (e) => new Date(e.date) > new Date() && !e.isExam
              ).length || 0,
            resources: 0, // No API for resources yet
            achievements: 0, // No API for achievements yet
          });

          // Set recent exams (up to 2)
          setRecentExams(examsResponse.data.slice(0, 2));
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching your dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Card Skeleton */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600">
          <CardHeader className="pb-2 sm:pb-4">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-white/20" />
            <Skeleton className="h-3 sm:h-4 w-36 sm:w-48 mt-2 bg-white/20" />
          </CardHeader>
          <CardContent className="pt-0 sm:pt-2">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 bg-white/20" />
          </CardContent>
        </Card>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-6 w-6" />
                </div>
              </CardContent>
              <CardFooter className="p-2">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Recent Exams Skeleton */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <Skeleton className="h-5 sm:h-6 w-36 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i} className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full  ">
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardHeader className="pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Active Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 sm:py-2">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.activeExams}
              </div>
              <GraduationCapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-1 sm:p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs sm:text-sm h-8 sm:h-9"
              asChild
            >
              <Link to="#" onClick={() => setCurrentPage("exams")}>
                View All{" "}
                <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 sm:py-2">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.upcomingEvents}
              </div>
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-1 sm:p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs sm:text-sm h-8 sm:h-9"
              asChild
            >
              <Link to="#" onClick={() => setCurrentPage("events")}>
                View All{" "}
                <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Available Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 sm:py-2">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.resources}
              </div>
              <BookOpenIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-1 sm:p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs sm:text-sm h-8 sm:h-9"
              asChild
            >
              <Link to="#" onClick={() => setCurrentPage("resources")}>
                View All{" "}
                <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 sm:py-2">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.achievements}
              </div>
              <TrophyIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
            </div>
          </CardContent>
          <CardFooter className="p-1 sm:p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs sm:text-sm h-8 sm:h-9"
              asChild
            >
              <Link to="#" onClick={() => setCurrentPage("achievements")}>
                View All{" "}
                <ArrowRightIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
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
          {recentExams.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recentExams.map((exam) => (
                <Card key={exam._id} className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm text-muted-foreground">
                      {exam.status === "completed"
                        ? `Completed on ${formatDate(exam.completedAt)}`
                        : "Not started yet"}
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: exam.status === "completed" ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => setCurrentPage("exams")}
                    >
                      {exam.status === "completed"
                        ? "View Results"
                        : "Start Exam"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                You haven't enrolled in any exams yet
              </p>
              <Button
                variant="default"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => setCurrentPage("exams")}
              >
                Browse Available Exams
              </Button>
            </div>
          )}
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
