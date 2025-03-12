import React, { useState } from "react";
import { useEvents } from "@/contexts/event-context";
import { useAuth } from "@/contexts/auth-context";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Filter,
  Clock,
  CalendarCheck,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CategoryBadge = ({ category }) => {
  const colors = {
    Workshop: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Competition: "bg-red-100 text-red-800 hover:bg-red-200",
    Seminar: "bg-green-100 text-green-800 hover:bg-green-200",
    Hackathon: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Meetup: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Conference: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    Webinar: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  };

  return (
    <Badge
      variant="outline"
      className={
        colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }
    >
      {category}
    </Badge>
  );
};

const EventSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-20 w-full mb-4" />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20 flex-1" />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const EmptyState = ({ message, buttonText, onClick }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-4">
      <Calendar className="h-8 w-8" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
    <p className="text-gray-500 mb-4 max-w-md mx-auto">
      Try adjusting your filters or search terms to find what you're looking
      for.
    </p>
    {buttonText && (
      <Button variant="default" size="default" onClick={onClick}>
        {buttonText}
      </Button>
    )}
  </div>
);

const AllEventsPage = () => {
  const { events, loading, fetchEvents, enrollInEvent, unenrollFromEvent } =
    useEvents();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEnrollment = async (eventId, isEnrolled) => {
    try {
      if (isEnrolled) {
        await unenrollFromEvent(eventId);
        setEnrollmentSuccess({
          message: "Successfully unenrolled from event",
          type: "info",
          redirectTo: "/dashboard",
        });
      } else {
        await enrollInEvent(eventId);
        setEnrollmentSuccess({
          message: "Successfully enrolled in event! View it on your dashboard.",
          type: "success",
          redirectTo: "/dashboard",
        });
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setEnrollmentSuccess(null);
      }, 5000);
    } catch (error) {
      console.error("Enrollment action failed:", error);
      setEnrollmentSuccess({
        message: "Failed to update enrollment. Please try again.",
        type: "error",
      });
    }
  };

  const refreshEvents = async () => {
    setIsRefreshing(true);
    try {
      await fetchEvents();
    } catch (error) {
      console.error("Failed to refresh events:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format date for better display
  const formatEventDate = (dateString, timeString) => {
    try {
      const date = new Date(dateString);
      return {
        date: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(date),
        time: timeString,
      };
    } catch (error) {
      return { date: dateString, time: timeString };
    }
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Events</h1>
          <p className="text-muted-foreground mt-1">
            Browse and enroll in upcoming coding events and activities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshEvents}
            disabled={isRefreshing}
            className="mr-2"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button variant="default" size="sm" onClick={goToDashboard}>
            <ExternalLink className="h-4 w-4 mr-1" />
            My Dashboard
          </Button>
        </div>
      </div>

      {/* Success/error message */}
      {enrollmentSuccess && (
        <Alert
          className={`mb-6 ${
            enrollmentSuccess.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : enrollmentSuccess.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          <AlertDescription className="flex justify-between items-center">
            <span>{enrollmentSuccess.message}</span>
            {enrollmentSuccess.redirectTo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (window.location.href = enrollmentSuccess.redirectTo)
                }
                className={`ml-2 ${
                  enrollmentSuccess.type === "success"
                    ? "border-green-200 bg-green-100"
                    : enrollmentSuccess.type === "error"
                    ? "border-red-200 bg-red-100"
                    : "border-blue-200 bg-blue-100"
                }`}
              >
                Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Onboarding message */}
      {isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How to participate in events
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>1. Browse and enroll in events below</p>
                <p>
                  2. View your enrolled events on{" "}
                  <a href="/dashboard" className="underline font-medium">
                    your dashboard
                  </a>
                </p>
                <p>3. Access event details and materials from your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and filter section */}
      <div className="mb-6 bg-card rounded-lg border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent" : ""}
                  inset={false}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          message="No events found"
          buttonText="Clear filters"
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("All");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const { date, time } = formatEventDate(event.date, event.time);
            const capacity = event.capacity || 100;
            const attendeePercent = Math.min(
              100,
              Math.round((event.attendees / capacity) * 100)
            );

            return (
              <Card
                key={event.id}
                className="flex flex-col h-full border-b-4"
                style={{
                  borderBottomColor:
                    attendeePercent > 90 ? "rgb(239 68 68)" : "rgb(16 185 129)",
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl line-clamp-1">
                        {event.eventName}
                      </CardTitle>
                      <CardDescription className="line-clamp-1 mt-1">
                        Organized by {event.organizer || "Coding Club"}
                      </CardDescription>
                    </div>
                    <CategoryBadge category={event.category} />
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {event.description}
                  </p>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="pt-1.5">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="text-muted-foreground">
                          <Users className="h-3.5 w-3.5 inline mr-1" />
                          {event.attendees} / {capacity}
                        </span>
                        <span
                          className={`${
                            attendeePercent > 90
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {attendeePercent}%
                        </span>
                      </div>
                      <Progress value={attendeePercent} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  {!isAuthenticated ? (
                    <Button
                      variant="default"
                      size="default"
                      className="w-full"
                      onClick={() => (window.location.href = "/login")}
                    >
                      Sign in to Enroll
                    </Button>
                  ) : (
                    <Button
                      variant={event.isEnrolled ? "outline" : "default"}
                      size="default"
                      onClick={() =>
                        handleEnrollment(event.id, !!event.isEnrolled)
                      }
                      className="w-full"
                    >
                      {event.isEnrolled ? "Unenroll" : "Enroll"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Link to dashboard reminder */}
      {filteredEvents.length > 0 && isAuthenticated && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-3">
            View your enrolled events and access materials on your dashboard
          </p>
          <Button variant="outline" size="default" onClick={goToDashboard}>
            Go to My Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllEventsPage;
