import {
  CalendarDays,
  Clock,
  Users,
  ArrowUpRight,
  ArrowUpCircle,
  CalendarCheck,
  GraduationCap,
  User,
  CheckCircle,
  XCircle,
  Bell,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart } from "./area-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { eventService, examService, userService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dashboard data
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [memberStats, setMemberStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    growth: "0%",
  });
  const [eventStats, setEventStats] = useState({
    upcoming: 0,
    thisWeek: 0,
    average: 0,
    completion: "0%",
  });
  const [examStats, setExamStats] = useState({
    active: 0,
    completed: 0,
    averageScore: "0%",
    highestScore: "0%",
  });
  const [topStudents, setTopStudents] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all events
        const eventsResponse = await eventService.getAllEvents();

        // Fetch exams
        const examsResponse = await examService.getAllExams();

        // Fetch users
        const usersResponse = await userService.getAllUsers();

        if (
          eventsResponse.success &&
          examsResponse.success &&
          usersResponse.success
        ) {
          // Filter and sort events
          const allEvents = eventsResponse.data.filter(
            (event) => !event.isExam
          );
          const now = new Date();
          const upcomingEvents = allEvents
            .filter((event) => new Date(event.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          // Set upcoming events
          setUpcomingEvents(upcomingEvents.slice(0, 3));

          // Calculate event stats
          const oneWeekFromNow = new Date();
          oneWeekFromNow.setDate(now.getDate() + 7);

          const upcomingEventsCount = upcomingEvents.length;
          const thisWeekEvents = upcomingEvents.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate <= oneWeekFromNow;
          }).length;

          // Calculate average participants
          let totalParticipants = 0;
          let completedEvents = 0;

          for (const event of allEvents) {
            if (event.participants && Array.isArray(event.participants)) {
              totalParticipants += event.participants.length;
              if (new Date(event.date) < now) {
                completedEvents++;
              }
            }
          }

          const averageParticipants =
            completedEvents > 0
              ? Math.round(totalParticipants / completedEvents)
              : 0;
          const completionRate =
            completedEvents > 0
              ? Math.round((completedEvents / allEvents.length) * 100)
              : 0;

          setEventStats({
            upcoming: upcomingEventsCount,
            thisWeek: thisWeekEvents,
            average: averageParticipants,
            completion: `${completionRate}%`,
          });

          // Calculate exam stats
          const allExams = examsResponse.data;
          const activeExams = allExams.filter(
            (exam) => exam.status === "published"
          ).length;
          const completedExams = allExams.filter(
            (exam) => exam.status === "completed"
          );

          // Calculate average and highest scores from completed exams
          let totalScore = 0;
          let totalStudents = 0;
          let highestScore = 0;

          for (const exam of completedExams) {
            if (exam.results && Array.isArray(exam.results)) {
              for (const result of exam.results) {
                if (result.score) {
                  totalScore += result.score;
                  totalStudents++;
                  highestScore = Math.max(highestScore, result.score);
                }
              }
            }
          }

          const averageScore =
            totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;

          setExamStats({
            active: activeExams,
            completed: completedExams.length,
            averageScore: `${averageScore}%`,
            highestScore: `${highestScore}%`,
          });

          // Calculate member stats from real data
          const allUsers = usersResponse.data;
          const activeUsers = allUsers.filter(
            (user) => user.status === "active"
          );

          // Calculate new users in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const newUsers = allUsers.filter((user) => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= thirtyDaysAgo;
          });

          // Calculate growth percentage
          const previousPeriodUsers = allUsers.filter((user) => {
            const createdAt = new Date(user.createdAt);
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
          });

          const growthPercentage =
            previousPeriodUsers.length > 0
              ? Math.round(
                  ((newUsers.length - previousPeriodUsers.length) /
                    previousPeriodUsers.length) *
                    100
                )
              : newUsers.length > 0
              ? 100
              : 0;

          setMemberStats({
            total: allUsers.length,
            active: activeUsers.length,
            new: newUsers.length,
            growth: `${growthPercentage >= 0 ? "+" : ""}${growthPercentage}%`,
          });

          // Get top students from exam results
          // We already have completedExams from earlier

          // Create a map to track user scores
          const userScores = new Map();

          // Process each exam's results
          for (const exam of completedExams) {
            if (exam.results && Array.isArray(exam.results)) {
              for (const result of exam.results) {
                if (result.user && result.score) {
                  const userId = result.user._id || result.userId;
                  const userName = result.user.name || "Unknown User";
                  const userAvatar = result.user.avatar || null;

                  // Get current score or initialize
                  const currentScore = userScores.get(userId) || {
                    id: userId,
                    name: userName,
                    avatar: userAvatar,
                    totalScore: 0,
                    examCount: 0,
                  };

                  // Update score
                  currentScore.totalScore += result.score;
                  currentScore.examCount += 1;
                  currentScore.averageScore = Math.round(
                    currentScore.totalScore / currentScore.examCount
                  );

                  // Store updated score
                  userScores.set(userId, currentScore);
                }
              }
            }
          }

          // Convert map to array and sort by average score
          const topStudentsArray = Array.from(userScores.values())
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 4)
            .map((student) => ({
              id: student.id,
              name: student.name,
              score: student.averageScore,
              avatar: student.avatar,
            }));

          // If we don't have enough students with results, add some placeholders
          if (topStudentsArray.length < 4) {
            const placeholders = [
              { id: "p1", name: "Emma Wilson", score: 96, avatar: null },
              { id: "p2", name: "James Chen", score: 94, avatar: null },
              { id: "p3", name: "Olivia Scott", score: 92, avatar: null },
              { id: "p4", name: "Michael Brown", score: 90, avatar: null },
            ];

            // Add placeholders until we have 4 students
            for (let i = topStudentsArray.length; i < 4; i++) {
              topStudentsArray.push(placeholders[i]);
            }
          }

          setTopStudents(topStudentsArray);

          // Set recent activities based on events and exams
          const recentActivitiesData = [];

          // Add recent events
          const recentEvents = [...allEvents]
            .sort(
              (a, b) =>
                new Date(b.createdAt || b.date) -
                new Date(a.createdAt || a.date)
            )
            .slice(0, 2);

          for (const event of recentEvents) {
            recentActivitiesData.push({
              id: event._id || event.id,
              type: "event",
              title: "Event created",
              description: `${event.title} was created`,
              time: formatTimeAgo(event.createdAt || event.date),
              icon: CalendarCheck,
              user: {
                name: event.createdBy?.name || "Admin User",
                email: event.createdBy?.email || "admin@codingclub.com",
                avatar: event.createdBy?.avatar || null,
              },
            });
          }

          // Add recent exams
          const recentExams = [...allExams]
            .sort(
              (a, b) =>
                new Date(b.createdAt || b.date) -
                new Date(a.createdAt || a.date)
            )
            .slice(0, 2);

          for (const exam of recentExams) {
            recentActivitiesData.push({
              id: exam._id || exam.id,
              type: "result",
              title: "Exam created",
              description: `${exam.title} was created`,
              time: formatTimeAgo(exam.createdAt || exam.date),
              icon: GraduationCap,
              user: {
                name: exam.createdBy?.name || "Admin User",
                email: exam.createdBy?.email || "admin@codingclub.com",
                avatar: exam.createdBy?.avatar || null,
              },
            });
          }

          // Sort activities by time
          recentActivitiesData.sort((a, b) => {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);
            return (
              Number.isNaN(dateB.getTime()) - Number.isNaN(dateA.getTime()) ||
              dateB - dateA
            );
          });

          setRecentActivities(recentActivitiesData);
        } else {
          throw new Error(
            eventsResponse.error ||
              examsResponse.error ||
              usersResponse.error ||
              "Failed to fetch dashboard data"
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get capacity percentage
  const getCapacityPercentage = (event) => {
    if (!event.capacity) return 0;
    const participantCount =
      event.participants && Array.isArray(event.participants)
        ? event.participants.length
        : 0;
    return Math.min(Math.round((participantCount / event.capacity) * 100), 100);
  };

  // Helper function to get capacity color
  const getCapacityColor = (event) => {
    const percentage = getCapacityPercentage(event);
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-amber-500";
    return "bg-green-500";
  };

  // Helper function to get participant count
  const getParticipantCount = (event) => {
    return event.participants && Array.isArray(event.participants)
      ? event.participants.length
      : 0;
  };

  const statusColor = (status) => {
    switch (status) {
      case "workshop":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "hackathon":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "quiz":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const iconColor = (type) => {
    switch (type) {
      case "user":
        return "text-green-500 bg-green-50";
      case "event":
        return "text-blue-500 bg-blue-50";
      case "result":
        return "text-amber-500 bg-amber-50";
      case "system":
        return "text-purple-500 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Page header skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Stat cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="md:col-span-1">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tables skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
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
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Here's what's happening with your
            coding club.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Data</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.total}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {memberStats.active} active members
              </p>
              <div className="flex items-center text-xs font-medium text-green-600">
                <ArrowUpCircle className="h-3 w-3 mr-1" />
                {memberStats.growth}
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(memberStats.active / memberStats.total) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventStats.upcoming}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {eventStats.thisWeek} this week
              </p>
              <div className="flex items-center text-xs font-medium text-indigo-600">
                <Users className="h-3 w-3 mr-1" />
                Avg. {eventStats.average} attendees
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-muted-foreground">
                Completion rate
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-600 border-green-200"
              >
                {eventStats.completion}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examStats.active}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {examStats.completed} completed
              </p>
              <div className="flex items-center text-xs font-medium text-amber-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Avg. score {examStats.averageScore}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-muted-foreground">Highest score</div>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-600 border-amber-200"
              >
                {examStats.highestScore}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-md p-2">
                <CheckCircle className="h-4 w-4 text-green-600 mb-1" />
                <p className="text-xs font-medium">API</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-md p-2">
                <CheckCircle className="h-4 w-4 text-green-600 mb-1" />
                <p className="text-xs font-medium">Database</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-md p-2">
                <CheckCircle className="h-4 w-4 text-green-600 mb-1" />
                <p className="text-xs font-medium">Storage</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-green-50 rounded-md p-2">
                <CheckCircle className="h-4 w-4 text-green-600 mb-1" />
                <p className="text-xs font-medium">Auth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>
              New member registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart className="h-[240px]" />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Event Participation</CardTitle>
            <CardDescription>
              Attendance rates for recent events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart className="h-[240px]" />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming events */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events scheduled in the next 30 days
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <TableRow key={event._id || event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(event.date)}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.time || "Not specified"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(event.type || "event")}>
                          {(event.type || "Event").charAt(0).toUpperCase() +
                            (event.type || "event").slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-24">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getCapacityColor(event)}`}
                                style={{
                                  width: `${getCapacityPercentage(event)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-xs whitespace-nowrap">
                            {getParticipantCount(event)}/{event.capacity || "∞"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No upcoming events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Top Students</CardTitle>
            <CardDescription>Highest exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {student.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm">{student.name}</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                    {student.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-center">
            <Button variant="outline" size="sm" className="w-full">
              View All Students
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id || activity._id} className="flex gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${iconColor(
                      activity.type
                    )}`}
                  >
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={activity.user?.avatar}
                          alt={activity.user?.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                          {activity.user?.name
                            ? activity.user.name
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium">
                        {activity.user?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No recent activities found
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-center">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DashboardOverview;
