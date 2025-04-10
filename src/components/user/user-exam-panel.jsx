import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
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
import { useNavigate } from "react-router-dom";

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

  const handleExamSubmit = async (examId, answers) => {
    setLoading(true);
    try {
      // Call the API to submit exam answers
      const response = await examService.submitExamAnswers(examId, answers);

      if (response.success) {
        // Update the exam in the local state
        const updatedExam = {
          ...exams.find((e) => e._id === examId),
          status: "completed",
          score: response.data.score,
          passingScore: response.data.passingScore || 70,
          passed: response.data.passed,
        };

        setExams(exams.map((e) => (e._id === examId ? updatedExam : e)));
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">My Exams</h2>
        </div>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="flex items-center py-6">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-red-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Exams</h2>
        <p className="text-muted-foreground">
          View and take your coding club exams
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="available" className="px-4 py-2">
              Available Exams
            </TabsTrigger>
            <TabsTrigger value="completed" className="px-4 py-2">
              Completed Exams
            </TabsTrigger>
          </TabsList>
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="available" className="mt-6">
          {filteredExams.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                No available exams found.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/exams")}
              >
                Browse Available Exams
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <Card key={exam._id || exam.id} className="flex flex-col">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-xl">{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Time Limit: {exam.timeLimit || exam.duration || "N/A"}{" "}
                          minutes
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Due Date:{" "}
                          {exam.dueDate || exam.endDate || "No due date"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2">
                          Questions:{" "}
                          {exam.questionCount ||
                            (exam.questions && exam.questions.length) ||
                            0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStartExam(exam)}
                    >
                      Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {filteredExams.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No completed exams found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <Card key={exam._id || exam.id} className="flex flex-col">
                  <CardHeader className="space-y-1">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{exam.title}</CardTitle>
                      {exam.passed !== undefined ? (
                        exam.passed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 border-green-200"
                          >
                            Passed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 border-red-200"
                          >
                            Failed
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-200"
                        >
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {exam.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      {exam.score !== undefined && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Score: {exam.score}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Passing: {exam.passingScore || 70}%
                            </span>
                          </div>
                          <Progress value={exam.score} className="h-2" />
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Completed:{" "}
                          {exam.completedAt
                            ? new Date(exam.completedAt).toLocaleDateString()
                            : exam.dueDate || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewResults(exam)}
                    >
                      View Results
                    </Button>
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
