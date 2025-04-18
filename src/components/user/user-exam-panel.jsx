import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Award,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamTakingModal } from "@/components/user/exam-taking-modal";
import { ExamResultsModal } from "@/components/user/exam-results-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { examService } from "@/services";
import { useNavigate, Link } from "react-router-dom";

export function UserExamPanel() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [isExamTakingModalOpen, setIsExamTakingModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // Fetch user's exams
  useEffect(() => {
    const fetchUserExams = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await examService.getUserExams();
        if (response.success) {
          setExams(response.data || []);
        } else {
          setError(response.error || "Failed to fetch exams");
        }
      } catch (err) {
        console.error("Error fetching user exams:", err);
        setError("An error occurred while fetching your exams");
      } finally {
        setLoading(false);
      }
    };

    fetchUserExams();
  }, []);

  const handleStartExam = (exam) => {
    setCurrentExam(exam);
    setIsExamTakingModalOpen(true);
  };

  const handleViewResults = (exam) => {
    setCurrentExam(exam);
    setIsResultsModalOpen(true);
  };

  const handleExamSubmit = async (examId, answers, timeSpent) => {
    setLoading(true);
    try {
      // Call the API to submit exam answers with time spent
      const response = await examService.submitExamAnswers(
        examId,
        answers,
        timeSpent
      );

      if (response.success) {
        // Get the result data
        const resultData = response.data.result || response.data;

        // Update the exam in the local state
        const updatedExam = {
          ...exams.find((e) => e._id === examId || e.id === examId),
          status: "completed",
          score: resultData.percentageScore || resultData.score,
          passingScore: resultData.passingScore || 40,
          passed: resultData.passed,
          completedAt: new Date(),
          resultId: resultData._id, // Store the result ID for viewing detailed results
        };

        setExams(
          exams.map((e) =>
            e._id === examId || e.id === examId ? updatedExam : e
          )
        );
        setCurrentExam(updatedExam);
        setIsExamTakingModalOpen(false);
        setIsResultsModalOpen(true);
      } else {
        setError(response.error || "Failed to submit exam");
      }
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError("An error occurred while submitting your exam");
    } finally {
      setLoading(false);
    }
  };

  // Filter exams based on active tab and search query
  const filteredExams = exams.filter(
    (exam) =>
      (activeTab === "available"
        ? exam.status === "available" || !exam.status
        : exam.status === "completed") &&
      (exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        !searchQuery)
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 sm:h-10 w-32 sm:w-40" />
        </div>

        <Skeleton className="h-8 sm:h-10 w-full" />

        <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
            My Exams
          </h2>
        </div>

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
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            My Exams
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View and take your coding club exams
          </p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/performance")}
            className="flex items-center text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto justify-center sm:justify-start"
          >
            <BarChart2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            My Performance
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <TabsList className="grid w-full sm:w-[300px] md:w-[400px] grid-cols-2">
            <TabsTrigger
              value="available"
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Available Exams
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              Completed Exams
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-8 text-xs sm:text-sm h-8 sm:h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="available" className="mt-4 sm:mt-6">
          {filteredExams.length === 0 ? (
            <div className="text-center p-4 sm:p-8 border rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                No available exams found.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => navigate("/exams")}
              >
                Browse Available Exams
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredExams.map((exam) => (
                <Card key={exam._id || exam.id} className="flex flex-col">
                  <CardHeader className="space-y-1 pb-2 sm:pb-3">
                    <CardTitle className="text-lg sm:text-xl">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {exam.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 py-1 sm:py-2">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <span>
                          Time Limit: {exam.timeLimit || exam.duration || "N/A"}{" "}
                          minutes
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <Calendar className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <span>
                          Due Date:{" "}
                          {exam.dueDate || exam.endDate || "No due date"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <span className="mr-1.5 sm:mr-2">
                          Questions:{" "}
                          {exam.questionCount || exam.questions?.length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 sm:pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => handleStartExam(exam)}
                    >
                      Start Exam{" "}
                      <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 sm:mt-6">
          {filteredExams.length === 0 ? (
            <div className="text-center p-4 sm:p-8 border rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                No completed exams found.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filteredExams.map((exam) => (
                <Card key={exam._id || exam.id} className="flex flex-col">
                  <CardHeader className="space-y-1 pb-2 sm:pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg sm:text-xl">
                        {exam.title}
                      </CardTitle>
                      {exam.passed !== undefined ? (
                        exam.passed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5"
                          >
                            Passed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5"
                          >
                            Failed
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs sm:text-sm px-1.5 sm:px-2 py-0.5"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs sm:text-sm">
                      {exam.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 py-1 sm:py-2">
                    <div className="space-y-3 sm:space-y-4">
                      {exam.score !== undefined && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs sm:text-sm font-medium">
                              Score: {exam.score}%
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              Passing: {exam.passingScore || 70}%
                            </span>
                          </div>
                          <Progress
                            value={exam.score}
                            className="h-1.5 sm:h-2"
                          />
                        </div>
                      )}
                      <div className="flex items-center text-xs sm:text-sm">
                        <Calendar className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <span>
                          Completed:{" "}
                          {exam.completedAt
                            ? new Date(exam.completedAt).toLocaleDateString()
                            : exam.dueDate || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 sm:pt-2">
                    <div className="flex space-x-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleViewResults(exam)}
                      >
                        View Results
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center h-8 sm:h-9 w-8 sm:w-9 p-0"
                        onClick={() =>
                          navigate(`/exams/${exam._id || exam.id}/leaderboard`)
                        }
                      >
                        <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ExamTakingModal
        isOpen={isExamTakingModalOpen}
        onClose={() => setIsExamTakingModalOpen(false)}
        onSubmit={handleExamSubmit}
        exam={currentExam}
      />

      <ExamResultsModal
        isOpen={isResultsModalOpen}
        onClose={() => setIsResultsModalOpen(false)}
        exam={currentExam}
      />
    </div>
  );
}
