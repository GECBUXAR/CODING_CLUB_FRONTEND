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
import { useState } from "react";

function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("month");

  // Sample data for the dashboard
  const upcomingEvents = [
    {
      id: 1,
      title: "JavaScript Workshop",
      date: "2025-03-10",
      time: "18:00",
      type: "workshop",
      status: "upcoming",
      participants: 28,
      capacity: 30,
    },
    {
      id: 2,
      title: "React Hackathon",
      date: "2025-03-15",
      time: "09:00",
      type: "hackathon",
      status: "upcoming",
      participants: 45,
      capacity: 50,
    },
    {
      id: 3,
      title: "Python Quiz",
      date: "2025-03-20",
      time: "17:00",
      type: "quiz",
      status: "upcoming",
      participants: 36,
      capacity: 40,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      title: "New member joined",
      description: "John Doe joined the club",
      time: "2 hours ago",
      icon: User,
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: null,
      },
    },
    {
      id: 2,
      type: "event",
      title: "Event created",
      description: "JavaScript Workshop was created",
      time: "1 day ago",
      icon: CalendarCheck,
      user: {
        name: "Admin User",
        email: "admin@codingclub.com",
        avatar: null,
      },
    },
    {
      id: 3,
      type: "result",
      title: "Results published",
      description: "HTML Quiz results are now available",
      time: "2 days ago",
      icon: GraduationCap,
      user: {
        name: "Admin User",
        email: "admin@codingclub.com",
        avatar: null,
      },
    },
    {
      id: 4,
      type: "system",
      title: "Settings updated",
      description: "Club settings were updated",
      time: "3 days ago",
      icon: Bell,
      user: {
        name: "System",
        email: "system@codingclub.com",
        avatar: null,
      },
    },
  ];

  const memberStats = {
    total: 128,
    active: 92,
    new: 12,
    growth: "+10.2%",
  };

  const eventStats = {
    upcoming: 7,
    thisWeek: 3,
    average: 32,
    completion: "94%",
  };

  const examStats = {
    active: 5,
    completed: 24,
    averageScore: "78%",
    highestScore: "98%",
  };

  const topStudents = [
    { id: 1, name: "Emma Wilson", score: 96, avatar: null },
    { id: 2, name: "James Chen", score: 94, avatar: null },
    { id: 3, name: "Olivia Scott", score: 92, avatar: null },
    { id: 4, name: "Michael Brown", score: 90, avatar: null },
  ];

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
              ></div>
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
                {upcomingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(event.date)}</span>
                        <span className="text-xs text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-24">
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                event.participants / event.capacity > 0.9
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${
                                  (event.participants / event.capacity) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {event.participants}/{event.capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
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
                        src={activity.user.avatar}
                        alt={activity.user.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                        {activity.user.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-medium">{activity.user.name}</p>
                  </div>
                </div>
              </div>
            ))}
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
