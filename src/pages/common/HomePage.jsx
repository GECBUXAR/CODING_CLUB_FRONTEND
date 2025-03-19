import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useEvents } from "@/contexts/event-context";
import { useExamContext } from "@/contexts/exam-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, BookOpen, Users, Clock, Search } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import SimpleFooter from "../../components/common/SimpleFooter";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    events = [],
    fetchEvents,
    enrollInEvent,
    userEvents = [],
  } = useEvents();
  const { exams = [] } = useExamContext() || { exams: [] };
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent repeated data fetching on re-renders
    if (dataFetchedRef.current) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchEvents();
        // Mark data as fetched
        dataFetchedRef.current = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchEvents]);

  // Function to check if user is enrolled in an event
  const isEnrolledInEvent = (eventId) => {
    if (!userEvents || userEvents.length === 0) return false;
    return userEvents.some((event) => event.id === eventId);
  };

  // Function to handle event enrollment
  const handleEnrollEvent = async () => {
    if (isAuthenticated) {
      await enrollInEvent();
      fetchEvents();
    } else {
      navigate("/login");
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (_) {
      return "Invalid date";
    }
  };

  // Filter events and exams based on search query
  const filteredEvents = Array.isArray(events)
    ? events.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.shortDescription
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredExams =
    exams &&
    exams.filter(
      (exam) =>
        exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Loading skeleton component
  const CardSkeleton = () => (
    <div className="rounded-xl overflow-hidden bg-white shadow-md">
      <div className="h-2 bg-gray-200"></div>
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Welcome to Code Crusaders
            </h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-10 rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white mt-16">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 tracking-tight">
              Welcome to <span className="text-blue-600">Code Crusaders</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore upcoming events and available exams. Enroll in courses and
              test your skills with our coding challenges.
            </p>
            <div className="w-16 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events and exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-l-lg py-3"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-r-lg py-3"
              >
                Exams
              </TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent
              value="events"
              className="mt-8 animate-in fade-in-50 duration-300"
            >
              {filteredEvents && filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 rounded-xl group"
                    >
                      <div className="h-2 bg-blue-600 group-hover:h-3 transition-all duration-300"></div>
                      <CardHeader className="p-5">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                            {event.title}
                          </CardTitle>
                          <Badge
                            variant={
                              event.category === "Workshop"
                                ? "secondary"
                                : "outline"
                            }
                            className="ml-2"
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-gray-600 line-clamp-2">
                          {event.shortDescription || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5 pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{event.time || "Time not specified"}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{event.attendees || 0} registered</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0">
                        {isEnrolledInEvent(event.id) ? (
                          <Button
                            variant="outline"
                            className="w-full bg-gray-50 border-gray-200 text-gray-700"
                            disabled
                            size="lg"
                          >
                            Already Enrolled
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnrollEvent()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            variant="default"
                            size="lg"
                          >
                            Enroll Now
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500 mb-2">No events found</p>
                  <p className="text-gray-400 text-center max-w-md">
                    {searchQuery
                      ? `No events matching "${searchQuery}"`
                      : "There are no upcoming events at the moment."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent
              value="exams"
              className="mt-8 animate-in fade-in-50 duration-300"
            >
              {filteredExams && filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => (
                    <Card
                      key={exam.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 rounded-xl group"
                    >
                      <div className="h-2 bg-indigo-600 group-hover:h-3 transition-all duration-300"></div>
                      <CardHeader className="p-5">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {exam.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200"
                          >
                            {exam.subject || "General"}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-gray-600 line-clamp-2">
                          {exam.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5 pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{exam.questionCount || 0} Questions</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{exam.duration || "N/A"} minutes</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>
                              Available until {formatDate(exam.endDate)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0">
                        <Button
                          onClick={() => navigate(`/exams/${exam.id}`)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                          variant="default"
                          size="lg"
                        >
                          View Exam
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
                  <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500 mb-2">No exams found</p>
                  <p className="text-gray-400 text-center max-w-md">
                    {searchQuery
                      ? `No exams matching "${searchQuery}"`
                      : "There are no available exams at the moment."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default HomePage;
