import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  BookOpen,
  Users,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  Trophy,
  GraduationCap,
  ChevronRight,
  Star,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import SimpleFooter from "../../components/common/SimpleFooter";

const HomePage = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const isAuthenticated = authState?.isAuthenticated || false;
  const user = authState?.user || null;

  // State for data
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [userExams, setUserExams] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs to track data loading status
  const dataFetchedRef = useRef({
    events: false,
    exams: false,
    userEvents: false,
    userExams: false,
  });

  // Debounce timer ref
  const timerRef = useRef(null);

  // Fetch public data (events and exams) with staggered loading
  // Use a ref to store the fetch function to prevent it from changing on every render
  const fetchPublicDataRef = useRef();

  // Initialize the fetch function once
  useEffect(() => {
    // Define the fetch function
    fetchPublicDataRef.current = async () => {
      // Skip if data is already fetched
      if (dataFetchedRef.current.events && dataFetchedRef.current.exams) {
        return;
      }

      let isMounted = true;
      const cleanup = () => {
        isMounted = false;
      };

      try {
        setLoading(true);

        // First, fetch upcoming events if not already fetched
        if (!dataFetchedRef.current.events) {
          try {
            console.log("Fetching upcoming events...");
            const eventsResponse = await eventService.getUpcomingEvents(6);

            if (!isMounted) return cleanup();

            if (eventsResponse.success) {
              setEvents(eventsResponse.data || []);

              // Set featured content (first 3 events)
              if (eventsResponse.data && eventsResponse.data.length > 0) {
                setFeaturedContent(eventsResponse.data.slice(0, 3));
              }

              dataFetchedRef.current.events = true;
            }
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        }

        // Add a delay before fetching exams
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!isMounted) return cleanup();

        // Then, fetch latest exams if not already fetched
        if (!dataFetchedRef.current.exams) {
          try {
            console.log("Fetching exams...");
            const examsResponse = await examService.getAllExams({
              limit: 6,
              sort: "createdAt",
            });

            if (!isMounted) return cleanup();

            if (examsResponse.success) {
              setExams(examsResponse.data || []);
              dataFetchedRef.current.exams = true;
            }
          } catch (error) {
            console.error("Error fetching exams:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchPublicData:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        cleanup();
      }
    };
  }, []); // Empty dependency array ensures this only runs once

  // Trigger the fetch on mount
  useEffect(() => {
    // Only fetch if we haven't already
    if (!dataFetchedRef.current.events || !dataFetchedRef.current.exams) {
      // Delay initial data loading slightly
      const timer = setTimeout(() => {
        if (fetchPublicDataRef.current) {
          fetchPublicDataRef.current();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array ensures this only runs once

  // Fetch user-specific data (user events and exams) with debouncing and staggered loading
  // Use a ref to store the fetch function to prevent it from changing on every render
  const fetchUserDataRef = useRef();

  // Update the fetch function when isAuthenticated changes
  useEffect(() => {
    // Define the fetch function
    fetchUserDataRef.current = async () => {
      // Skip if not authenticated
      if (!isAuthenticated) {
        return;
      }

      // Skip if data is already fetched
      if (
        dataFetchedRef.current.userEvents &&
        dataFetchedRef.current.userExams
      ) {
        return;
      }

      let isMounted = true;
      const cleanup = () => {
        isMounted = false;
      };

      try {
        // Fetch user's enrolled events if not already fetched
        if (!dataFetchedRef.current.userEvents) {
          try {
            console.log("Fetching user events...");
            const userEventsResponse = await eventService.getUserEvents();

            if (!isMounted) return cleanup();

            if (userEventsResponse.success) {
              setUserEvents(userEventsResponse.data || []);
              dataFetchedRef.current.userEvents = true;
            }
          } catch (error) {
            console.error("Error fetching user events:", error);
          }
        }

        // Add a delay before fetching user exams
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!isMounted) return cleanup();

        // Fetch user's enrolled exams if not already fetched
        if (!dataFetchedRef.current.userExams) {
          try {
            console.log("Fetching user exams...");
            const userExamsResponse = await examService.getUserExams();

            if (!isMounted) return cleanup();

            if (userExamsResponse.success) {
              setUserExams(userExamsResponse.data || []);
              dataFetchedRef.current.userExams = true;
            }
          } catch (error) {
            console.error("Error fetching user exams:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);
      } finally {
        cleanup();
      }
    };
  }, [isAuthenticated]); // Include isAuthenticated in the dependency array

  // Trigger the fetch when authentication changes
  useEffect(() => {
    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

    // Only fetch if we haven't already
    if (
      !dataFetchedRef.current.userEvents ||
      !dataFetchedRef.current.userExams
    ) {
      // Delay user data loading to prioritize public data
      const timer = setTimeout(() => {
        if (fetchUserDataRef.current) {
          fetchUserDataRef.current();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated

  // Function to check if user is enrolled in an event
  const isEnrolledInEvent = (eventId) => {
    if (!userEvents || userEvents.length === 0) return false;
    return userEvents.some((event) => event._id === eventId);
  };

  // Function to check if user is enrolled in an exam
  const isEnrolledInExam = (examId) => {
    if (!userExams || userExams.length === 0) return false;
    return userExams.some((exam) => exam._id === examId);
  };

  // State to track enrollment operations in progress
  const [enrollingEvent, setEnrollingEvent] = useState(false);
  const [enrollingExam, setEnrollingExam] = useState(false);

  // Function to handle event enrollment with optimistic update
  const handleEnrollEvent = useCallback(
    async (eventId) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      // Prevent multiple simultaneous enrollments
      if (enrollingEvent) return;

      setEnrollingEvent(true);

      try {
        // Optimistic update - add the event to userEvents immediately
        const eventToAdd = events.find((e) => e._id === eventId);
        if (eventToAdd) {
          // Create a temporary version with enrollment status
          const tempEvent = { ...eventToAdd, isEnrolled: true };
          setUserEvents((prev) => [...prev, tempEvent]);
        }

        // Make the actual API call
        const response = await eventService.registerForEvent(eventId);

        if (!response.success) {
          // If the API call failed, revert the optimistic update
          setUserEvents((prev) => prev.filter((e) => e._id !== eventId));
          console.error("Failed to enroll in event:", response.error);
        } else {
          // Mark user events as needing refresh on next load
          dataFetchedRef.current.userEvents = false;
        }
      } catch (error) {
        // Revert optimistic update on error
        setUserEvents((prev) => prev.filter((e) => e._id !== eventId));
        console.error("Error enrolling in event:", error);
      } finally {
        setEnrollingEvent(false);
      }
    },
    [events, isAuthenticated, navigate, enrollingEvent]
  );

  // Function to handle exam enrollment with optimistic update
  const handleEnrollExam = useCallback(
    async (examId) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      // Prevent multiple simultaneous enrollments
      if (enrollingExam) return;

      setEnrollingExam(true);

      try {
        // Optimistic update - add the exam to userExams immediately
        const examToAdd = exams.find((e) => e._id === examId);
        if (examToAdd) {
          // Create a temporary version with enrollment status
          const tempExam = { ...examToAdd, isEnrolled: true };
          setUserExams((prev) => [...prev, tempExam]);
        }

        // Make the actual API call
        const response = await examService.registerForExam(examId);

        if (!response.success) {
          // If the API call failed, revert the optimistic update
          setUserExams((prev) => prev.filter((e) => e._id !== examId));
          console.error("Failed to enroll in exam:", response.error);
        } else {
          // Mark user exams as needing refresh on next load
          dataFetchedRef.current.userExams = false;
        }
      } catch (error) {
        // Revert optimistic update on error
        setUserExams((prev) => prev.filter((e) => e._id !== examId));
        console.error("Error enrolling in exam:", error);
      } finally {
        setEnrollingExam(false);
      }
    },
    [exams, isAuthenticated, navigate, enrollingExam]
  );

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
          event.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          event.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredExams = Array.isArray(exams)
    ? exams.filter(
        (exam) =>
          exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Loading skeleton component
  const CardSkeleton = () => (
    <div className="rounded-xl overflow-hidden bg-white shadow-md">
      <div className="h-2 bg-gray-200" />
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

  // Hero section skeleton
  const HeroSkeleton = () => (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-md">
      <Skeleton className="h-64 w-full" />
      <div className="p-6">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            <HeroSkeleton />

            <div className="mt-16">
              <Skeleton className="h-8 w-64 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>

            <div className="mt-16">
              <Skeleton className="h-8 w-64 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Elevate Your Coding Skills with Code Crusaders
                </h1>
                {/* <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  Join our community of developers, participate in events, and
                  test your knowledge with our coding exams.
                </p> */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate("/events")}
                  >
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/assets/images/hero-illustration.svg"
                  alt="Coding illustration"
                  className="max-w-full h-auto rounded-lg shadow-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Back Section (for authenticated users) */}
      {isAuthenticated && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome back, {user?.name || "Coder"}!
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Continue your learning journey
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/${user?.role || "user"}/dashboard`)}
                >
                  Go to Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Enrolled Events</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {userEvents.length}
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4 flex items-center">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-700">Enrolled Exams</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      {userExams.length}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <Trophy className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700">Achievements</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      {Math.floor(Math.random() * 10)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Content Section */}
      {featuredContent.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-8">
              <Sparkles className="h-6 w-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Featured Content
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredContent.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Star className="h-16 w-16 text-white opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-4">
                        <Badge className="mb-2 bg-white/90 text-blue-700 hover:bg-white">
                          {item.category || "Featured"}
                        </Badge>
                        <h3 className="text-xl font-bold text-white">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {item.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                        onClick={() => navigate(`/events/${item._id}`)}
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Find Events & Exams
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-3 text-base"
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3 text-base"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Exams
              </TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent
              value="events"
              className="animate-in fade-in-50 duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Upcoming Events
                  </h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/events")}
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {filteredEvents && filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event._id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 rounded-xl group h-full flex flex-col"
                    >
                      <div className="h-2 bg-blue-600 group-hover:h-3 transition-all duration-300" />
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
                          {event.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5 pt-0 flex-grow">
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
                            <span>
                              {event.participants?.length || 0} registered
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 mt-auto">
                        {isEnrolledInEvent(event._id) ? (
                          <Button
                            variant="outline"
                            className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            onClick={() => navigate(`/events/${event._id}`)}
                          >
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnrollEvent(event._id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            variant="default"
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
              className="animate-in fade-in-50 duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <GraduationCap className="h-6 w-6 text-indigo-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Available Exams
                  </h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/exams")}
                  className="text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:border-indigo-300"
                >
                  View All Exams
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {filteredExams && filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => (
                    <Card
                      key={exam._id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 rounded-xl group h-full flex flex-col"
                    >
                      <div className="h-2 bg-indigo-600 group-hover:h-3 transition-all duration-300" />
                      <CardHeader className="p-5">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {exam.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200"
                          >
                            {exam.category || "General"}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-gray-600 line-clamp-2">
                          {exam.description || "No description available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-5 pt-0 flex-grow">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{exam.questions?.length || 0} Questions</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{exam.duration || "N/A"} minutes</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{exam.difficulty || "Beginner"} Level</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 mt-auto">
                        {isEnrolledInExam(exam._id) ? (
                          <Button
                            onClick={() => navigate(`/exams/${exam._id}`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            variant="default"
                          >
                            Start Exam
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnrollExam(exam._id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            variant="default"
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

      {/* Call to Action Section */}

      <SimpleFooter />
    </div>
  );
};

export default HomePage;
