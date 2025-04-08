import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  CalendarIcon,
  BookOpen,
  Users,
  Clock,
  Search,
  Code,
  Award,
  Zap,
  ChevronRight,
  Star,
  ArrowRight,
  Sparkles,
  Rocket,
  GraduationCap,
  Trophy,
} from "lucide-react";
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            {/* Hero skeleton */}
            <div className="flex flex-col items-center justify-center py-16 mb-12">
              <Skeleton className="h-12 w-3/4 max-w-xl mb-6" />
              <Skeleton className="h-6 w-2/3 max-w-md mb-8" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>

            {/* Featured section skeleton */}
            <div className="mb-16">
              <Skeleton className="h-8 w-64 mb-8 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
              </div>
            </div>

            {/* Content skeleton */}
            <Skeleton className="h-10 w-48 mb-6 mx-auto" />
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="py-16 md:py-24 text-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Hero content */}
            <div className="relative z-10">
              <Badge className="mb-6 px-4 py-2 bg-blue-50 text-blue-700 border-blue-100 rounded-full text-sm font-medium">
                <Rocket className="w-4 h-4 mr-1 inline" /> Coding Club Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-800 tracking-tight leading-tight">
                Elevate Your{" "}
                <span className="text-blue-600 relative">
                  Coding Skills
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-100 -z-10 rounded-lg"></span>
                </span>
              </h1>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join our community of developers, participate in events, and
                test your skills with our coding challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-lg"
                >
                  <Code className="mr-2 h-5 w-5" /> Explore Events
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-6 rounded-full font-medium text-lg"
                >
                  <BookOpen className="mr-2 h-5 w-5" /> Browse Exams
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <div className="py-16 mb-16">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 rounded-full"
              >
                <Award className="w-3.5 h-3.5 mr-1 inline" /> Featured
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Why Join Our Coding Club?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Discover the benefits of being part of our growing community of
                developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border border-slate-100 group hover:border-blue-100">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                  <Code className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Skill Development
                </h3>
                <p className="text-slate-600">
                  Enhance your coding skills through structured learning paths
                  and hands-on projects.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border border-slate-100 group hover:border-indigo-100">
                <div className="w-14 h-14 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Users className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Community Support
                </h3>
                <p className="text-slate-600">
                  Connect with like-minded developers, share knowledge, and
                  collaborate on projects.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 border border-slate-100 group hover:border-purple-100">
                <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                  <Trophy className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Competitive Edge
                </h3>
                <p className="text-slate-600">
                  Participate in coding competitions and challenges to test your
                  skills and win prizes.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-12 bg-white rounded-full shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <input
              type="text"
              placeholder="Search events and exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Content Section Header */}
          <div className="text-center mb-10">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 rounded-full"
            >
              <Zap className="w-3.5 h-3.5 mr-1 inline" /> Explore
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Upcoming Events & Exams
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Browse our latest events and coding challenges to enhance your
              skills.
            </p>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-100 p-1 rounded-xl">
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg py-3 font-medium transition-all"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="exams"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg py-3 font-medium transition-all"
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

          {/* Testimonials Section */}
          <div className="py-16 mt-16 bg-slate-50 rounded-2xl px-6 md:px-12">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="mb-4 px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 rounded-full"
              >
                <Star className="w-3.5 h-3.5 mr-1 inline" /> Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                What Our Members Say
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Hear from our community members about their experiences with
                Code Crusaders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">AK</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Aditya Kumar</h4>
                    <p className="text-slate-500 text-sm">
                      Computer Science Student
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">
                  "The coding challenges helped me prepare for technical
                  interviews. I landed my dream internship thanks to the skills
                  I developed here!"
                </p>
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">SP</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Shreya Patel</h4>
                    <p className="text-slate-500 text-sm">Web Developer</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">
                  "The community support is amazing! I've learned so much from
                  collaborating with other members on projects and participating
                  in hackathons."
                </p>
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">RJ</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Rahul Joshi</h4>
                    <p className="text-slate-500 text-sm">Software Engineer</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4">
                  "The structured learning paths and expert-led workshops have
                  significantly improved my problem-solving skills. Highly
                  recommended for anyone serious about coding!"
                </p>
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 mt-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Join our community today and take your coding skills to the next
              level.
            </p>
            <Button
              variant="default"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-medium text-lg"
            >
              <GraduationCap className="mr-2 h-5 w-5" /> Join Code Crusaders
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Code Crusaders</h3>
              <p className="text-slate-400 mb-4">
                Empowering developers through community, education, and
                practice.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Exams
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Learning Paths
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-slate-400 mb-4">
                Stay updated with our latest events and news.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-white border-slate-700"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Code Crusaders. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
