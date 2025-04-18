import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  XIcon,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { eventService } from "@/services";

export function EventSection() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventService.getUserEvents();
        if (response.success) {
          // Filter events into upcoming and past
          const now = new Date();
          const upcoming = [];
          const past = [];

          response.data.forEach((event) => {
            // Skip exams, only show regular events
            if (event.isExam) return;

            const eventDate = new Date(event.date);
            if (eventDate > now) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });

          setActiveEvents(upcoming);
          setPastEvents(past);
        } else {
          setError(response.error || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Error fetching user events:", err);
        setError("An error occurred while fetching your events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Skeleton className="h-8 sm:h-10 w-full" />

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="flex items-center py-4 sm:py-6">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2 sm:mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800 text-sm sm:text-base">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="upcoming"
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
          >
            Past Events
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent
          value="upcoming"
          className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
        >
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {activeEvents.length > 0 ? (
              activeEvents.map((event) => (
                <Card key={event._id || event.id} className="overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg sm:text-xl">
                        {event.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5"
                      >
                        Enrolled
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {event.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      <div className="flex items-center text-xs sm:text-sm">
                        <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                        <span className="truncate">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <ClockIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                        <span className="truncate">
                          {event.time || "Time not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPinIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                        <span className="truncate">
                          {event.location || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <UsersIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                        <span className="truncate">
                          {event.participants?.length || 0} participants
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() =>
                        navigate(`/events/${event._id || event.id}`)
                      }
                    >
                      Event Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => {
                        // Create calendar event URL
                        const eventDate = new Date(event.date);
                        const endDate = new Date(eventDate);
                        endDate.setHours(endDate.getHours() + 2); // Default 2 hours duration

                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          event.title
                        )}&dates=${eventDate
                          .toISOString()
                          .replace(/-|:|\.\d+/g, "")}/${endDate
                          .toISOString()
                          .replace(
                            /-|:|\.\d+/g,
                            ""
                          )}&details=${encodeURIComponent(
                          event.description || ""
                        )}&location=${encodeURIComponent(
                          event.location || ""
                        )}`;

                        window.open(calendarUrl, "_blank");
                      }}
                    >
                      Add to Calendar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center p-6 sm:p-10 bg-muted rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-medium">
                  No Upcoming Events
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-3 sm:mb-4">
                  You're not enrolled in any upcoming events
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => navigate("/events")}
                >
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Past Events Tab */}
        <TabsContent
          value="past"
          className="space-y-3 sm:space-y-4 mt-4 sm:mt-6"
        >
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <Card key={event._id || event.id}>
                  <CardHeader className="space-y-1 pb-2 sm:pb-3">
                    <CardTitle className="text-lg sm:text-xl">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {event.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 py-1 sm:py-2">
                    <div className="flex items-center text-xs sm:text-sm">
                      <CalendarIcon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-70" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 border-t pt-2 sm:pt-3">
                      <h4 className="text-xs sm:text-sm font-medium">
                        Event Results
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <div className="flex items-center">
                          <span className="mr-1.5 sm:mr-2 font-medium">
                            Attendance:
                          </span>
                          {event.attendance?.attended ? (
                            <span className="flex items-center text-green-600">
                              <CheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />{" "}
                              Attended
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />{" "}
                              Absent
                            </span>
                          )}
                        </div>

                        {event.result?.position && (
                          <div className="flex items-center">
                            <span className="mr-1.5 sm:mr-2 font-medium">
                              Position:
                            </span>
                            <span className="text-amber-600 font-medium">
                              {event.result.position === 1
                                ? "1st Place 🥇"
                                : event.result.position === 2
                                ? "2nd Place 🥈"
                                : event.result.position === 3
                                ? "3rd Place 🥉"
                                : `${event.result.position}th Place`}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center col-span-1 sm:col-span-2">
                          <span className="mr-1.5 sm:mr-2 font-medium">
                            Certificate:
                          </span>
                          {event.certificate ? (
                            <span className="flex items-center text-green-600">
                              <CheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />{" "}
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />{" "}
                              Not Available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-1 sm:pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() =>
                        navigate(`/events/${event._id || event.id}`)
                      }
                    >
                      View Details
                    </Button>
                    {event.certificate && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() =>
                          window.open(event.certificateUrl || "#", "_blank")
                        }
                      >
                        Download Certificate
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center p-6 sm:p-10 bg-muted rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-medium">
                  No Past Events
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  You haven't participated in any events yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => navigate("/events")}
                >
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
