import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  BookOpen,
  Filter,
  ChevronDown,
  Tag,
  BarChart,
  RefreshCw,
  ArrowRight,
  Trophy,
  AlertTriangle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/optimized-auth-context";
import { examService } from "@/services/index.js";

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
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

// No longer using mock data - using real data from API

const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    Beginner: "bg-green-100 text-green-800 hover:bg-green-200",
    Intermediate: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Advanced: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <Badge
      variant="outline"
      className={styles[difficulty] || "bg-gray-100 text-gray-800"}
    >
      {difficulty}
    </Badge>
  );
};

const ExamSkeleton = () => (
  <Card className="h-full">
    <CardHeader className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-16 w-full mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-2">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

const EmptyState = ({ message, buttonText, onClick }) => (
  <div className="text-center py-16 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-4">
      <BookOpen className="h-8 w-8" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
    <p className="text-gray-500 mb-4 max-w-md mx-auto">
      Try adjusting your filters or search terms to find what you're looking
      for.
    </p>
    {buttonText && (
      <Button
        variant="default"
        size="default"
        className="mt-2"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    )}
  </div>
);

const AllExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [isLoading, setIsLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const { state } = useAuth();
  const user = state?.user || { role: "user" };
  const isAuthenticated = state?.isAuthenticated || false;

  // Fetch exams from API
  useEffect(() => {
    // Using a ref to track if we've already fetched exams to prevent unnecessary API calls
    const fetchData = async () => {
      await fetchExams();
    };
    fetchData();
    // Empty dependency array ensures this only runs once on mount
  }, []);

  const fetchExams = async () => {
    setIsLoading(true);
    try {
      const response = await examService.getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        console.error("Failed to fetch exams:", response.error);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique categories and difficulties for filters
  const categories = Array.from(new Set(exams.map((exam) => exam.category)));
  const difficulties = Array.from(
    new Set(exams.map((exam) => exam.difficulty))
  );

  // Filter exams based on search and filter criteria
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || exam.category === filterCategory;
    const matchesDifficulty =
      filterDifficulty === "" || exam.difficulty === filterDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort exams
  const sortedExams = [...filteredExams].sort((a, b) => {
    if (sortBy === "title") return a.title?.localeCompare(b.title) || 0;
    if (sortBy === "difficulty") {
      const order = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
    }
    if (sortBy === "duration") return (a.duration || 0) - (b.duration || 0);
    if (sortBy === "questions")
      return (a.questions?.length || 0) - (b.questions?.length || 0);
    if (sortBy === "passRate") return (b.passRate || 0) - (a.passRate || 0);
    if (sortBy === "popularity")
      return (b.popularity || 0) - (a.popularity || 0);
    return 0;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterDifficulty("");
  };

  const refreshExams = async () => {
    await fetchExams();
  };

  const handleEnrollment = async (examId) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      // Get the exam details
      const exam = exams.find((e) => e._id === examId);
      const isEnrolled = exam?.isEnrolled;

      // Call the API to register or unregister
      let response;
      if (isEnrolled) {
        // This would be implemented if there was an unregister endpoint
        console.log("Unregister functionality not implemented in the backend");
        // For now, we'll just update the UI
      } else {
        response = await examService.registerForExam(examId);
      }

      if (response?.success || !isEnrolled) {
        // Update the enrollment status in our local state
        const updatedExams = exams.map((exam) => {
          if (exam._id === examId) {
            return { ...exam, isEnrolled: !isEnrolled };
          }
          return exam;
        });

        setExams(updatedExams);

        // Show success message
        setEnrollmentSuccess({
          message: !isEnrolled
            ? `Successfully enrolled in "${exam.title}". Access it from your dashboard to start.`
            : `Unenrolled from "${exam.title}".`,
          type: !isEnrolled ? "success" : "info",
          redirectTo: !isEnrolled ? `/${user.role}/dashboard` : null,
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setEnrollmentSuccess(null);
        }, 5000);
      } else {
        throw new Error(response?.error || "Failed to update enrollment");
      }
    } catch (error) {
      console.error("Enrollment action failed:", error);
      setEnrollmentSuccess({
        message:
          error.message || "Failed to update enrollment. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    window.location.href = `/${user.role}/dashboard`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Exams</h1>
          <p className="text-muted-foreground mt-1">
            Browse and enroll in exams to test your skills
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshExams}
            disabled={isLoading}
            className="mr-2"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="default"
            size="sm"
            className="ml-2"
            onClick={goToDashboard}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            My Dashboard
          </Button>
        </div>
      </div>

      {/* Success/error message */}
      {enrollmentSuccess && (
        <Alert
          variant="default"
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
                onClick={() => {
                  window.location.href = enrollmentSuccess.redirectTo;
                }}
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
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                How to take exams
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>1. Browse and enroll in exams below</p>
                <p>
                  2. Access your enrolled exams from{" "}
                  <a href="/dashboard" className="underline font-medium">
                    your dashboard
                  </a>
                </p>
                <p>3. Start the exam when you're ready from your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:space-y-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {filterCategory || "Category"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => setFilterCategory("")}
                  inset={false}
                  className="cursor-pointer"
                >
                  All Categories
                </DropdownMenuItem>
                <Separator className="my-1" />
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={filterCategory === category ? "bg-accent" : ""}
                    inset={false}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto"
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  {filterDifficulty || "Difficulty"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => setFilterDifficulty("")}
                  inset={false}
                  className="cursor-pointer"
                >
                  All Levels
                </DropdownMenuItem>
                <Separator className="my-1" />
                {difficulties.map((difficulty) => (
                  <DropdownMenuItem
                    key={difficulty}
                    onClick={() => setFilterDifficulty(difficulty)}
                    className={
                      filterDifficulty === difficulty ? "bg-accent" : ""
                    }
                    inset={false}
                  >
                    {difficulty}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Sort By
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => setSortBy("popularity")}
                  className={sortBy === "popularity" ? "bg-accent" : ""}
                  inset={false}
                >
                  Popularity
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("title")}
                  className={sortBy === "title" ? "bg-accent" : ""}
                  inset={false}
                >
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("difficulty")}
                  className={sortBy === "difficulty" ? "bg-accent" : ""}
                  inset={false}
                >
                  Difficulty (Easy to Hard)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("duration")}
                  className={sortBy === "duration" ? "bg-accent" : ""}
                  inset={false}
                >
                  Duration (Shortest First)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("passRate")}
                  className={sortBy === "passRate" ? "bg-accent" : ""}
                  inset={false}
                >
                  Pass Rate (Highest First)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(searchTerm || filterCategory || filterDifficulty) && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredExams.length} of {exams.length} exams
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Exams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ExamSkeleton key={i} />
          ))}
        </div>
      ) : filteredExams.length === 0 ? (
        <EmptyState
          message="No exams found"
          buttonText="Clear filters"
          onClick={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedExams.map((exam) => (
            <Card
              key={exam._id}
              className={`flex flex-col h-full hover:shadow-md transition-shadow duration-200 ${
                exam.isEnrolled ? "border-primary border-2" : ""
              }`}
            >
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl line-clamp-1">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">
                      {exam.category}
                    </CardDescription>
                  </div>
                  <DifficultyBadge difficulty={exam.difficulty} />
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                  {exam.description}
                </p>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.questions} questions</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className="text-muted-foreground">Pass Rate</span>
                    <span
                      className={
                        exam.passRate > 70
                          ? "text-green-600"
                          : exam.passRate > 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {exam.passRate}%
                    </span>
                  </div>
                  <Progress value={exam.passRate} className="h-1.5" />

                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">{exam.recentAttempts}</span>{" "}
                    recent attempts
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
                ) : exam.isEnrolled ? (
                  <div className="flex flex-col w-full space-y-2">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => handleEnrollment(exam._id)}
                      className="w-full"
                    >
                      <BookmarkCheck className="mr-1 h-4 w-4 text-green-600" />
                      Enrolled
                    </Button>
                    <Button
                      variant="default"
                      size="default"
                      onClick={goToDashboard}
                      className="w-full"
                    >
                      Open in Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => handleEnrollment(exam._id)}
                    className="w-full"
                  >
                    <Bookmark className="mr-1 h-4 w-4" />
                    Enroll in Exam
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Link to dashboard reminder */}
      {filteredExams.some((exam) => exam.isEnrolled) && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-3">
            Start your enrolled exams from your dashboard
          </p>
          <Button
            variant="outline"
            size="default"
            className="mt-2"
            onClick={goToDashboard}
          >
            Go to My Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AllExams;
