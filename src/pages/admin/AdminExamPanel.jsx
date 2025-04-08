import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash,
  FileText,
  Check,
  X,
  Settings,
  Users,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Lock,
  PlusCircle,
  List,
  Upload,
  BarChart,
  Trophy,
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
  ClipboardCheck as ClipboardCheckIcon,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { ExamFormModal } from "@/components/admin/exam-form-modal";
import { QuestionFormModal } from "@/components/admin/question-form-modal";
import { ExamSettingsModal } from "@/components/admin/exam-settings-modal";
import { ExamResponsesPanel } from "@/components/admin/exam-responses-panel";
import { ExamProvider, useExamContext } from "@/contexts/exam-context";
import { useNotification } from "@/contexts/notification-context";
import { getExams, deleteExam, createExam, updateExam } from "../../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ErrorFallback component to display when errors occur
function ErrorFallback({ error }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <p className="mb-4">{error?.message || "An unexpected error occurred"}</p>
      <Button
        onClick={() => window.location.reload()}
        variant="default"
        size="default"
        className="px-4 py-2"
      >
        Try Again
      </Button>
    </div>
  );
}

// SafeComponent to handle context errors
function SafeComponent({ fallback, render }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasError) {
      // Log the error
      console.error("Error in SafeComponent:", error);
    }
  }, [hasError, error]);

  if (hasError) {
    return fallback(error);
  }

  try {
    return render();
  } catch (err) {
    setHasError(true);
    setError(err);
    return fallback(err);
  }
}

// Wrapper component that provides the ExamContext
export function AdminExamPanel() {
  return (
    <div className="container mx-auto p-4">
      <ExamProvider>
        <SafeComponent
          fallback={(error) => <ErrorFallback error={error} />}
          render={() => <AdminExamPanelContent />}
        />
      </ExamProvider>
    </div>
  );
}

// Content component that consumes the ExamContext
function AdminExamPanelContent() {
  // All hooks at the top level - NEVER inside conditions
  const examContext = useExamContext();
  const { showNotification } = useNotification();

  // Component state
  const [currentExam, setCurrentExam] = useState(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResponsePanelOpen, setIsResponsePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAllExams, setShowAllExams] = useState(true);
  const [showExamFormModal, setShowExamFormModal] = useState(false);
  const [showUploadResultsModal, setShowUploadResultsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date-desc");

  // Destructure safely
  const { state, dispatch, getExamById } = examContext || {};
  const exams = state?.exams || [];

  // Filter exams based on search query and status
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam?.title
      ?.toLowerCase()
      .includes(searchQuery?.toLowerCase() || "");
    const matchesStatus =
      selectedStatus === "all" || exam?.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "closed", label: "Closed" },
  ];

  // Calculate some stats
  const examStats = {
    total: exams.length,
    published: exams.filter((exam) => exam.status === "published").length,
    draft: exams.filter((exam) => exam.status === "draft").length,
    closed: exams.filter((exam) => exam.status === "closed").length,
  };

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsOfflineMode(false);

        // Try to fetch from API
        const response = await getExams();

        if (response?.success) {
          // Use data from API
          dispatch({
            type: "SET_EXAMS",
            payload: response.data || [],
          });
          console.log("Successfully loaded exams from API");
        } else {
          // Check if we're in development with fallback data
          if (response?.usingFallbackData) {
            console.log("Using sample data for development testing");
          } else {
            console.warn(
              "Failed to fetch exams from API, using sample data",
              response?.error || ""
            );
          }

          // Set offline mode flag
          setIsOfflineMode(true);

          // Show offline mode notification to user
          if (typeof showNotification === "function") {
            showNotification(
              "Using local sample data for testing",
              "info",
              3000
            );
          }
        }
      } catch (error) {
        console.warn("Error fetching exams, using sample data:", error);

        // Set offline mode flag
        setIsOfflineMode(true);

        // Show offline mode notification to user
        if (typeof showNotification === "function") {
          showNotification("Using local sample data for testing", "info", 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExamsData();
  }, [dispatch, showNotification]);

  // Error fallback
  if (error) {
    return <ErrorFallback error={error} />;
  }

  // Function to handle editing an exam
  const handleEditExam = (examId) => {
    setCurrentExam(getExamById(examId));
    setIsExamModalOpen(true);
  };

  // Function to handle deleting an exam
  const handleDeleteExam = async () => {
    if (!currentExam) return;

    try {
      // Delete the exam via API
      const response = await deleteExam(currentExam.id);

      if (response.success) {
        // Update the local state
        dispatch({
          type: "DELETE_EXAM",
          payload: currentExam.id,
        });

        // Show success notification
        if (typeof showNotification === "function") {
          showNotification("Exam deleted successfully", "success");
        } else {
          console.log("Success: Exam deleted successfully");
        }
      } else {
        throw new Error(response.error || "Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);

      // Show error notification
      if (typeof showNotification === "function") {
        showNotification(`Error: ${error.message}`, "error");
      } else {
        console.error(`Failed to delete exam: ${error.message}`);
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Function to handle adding questions to an exam
  const handleAddQuestions = (examId) => {
    setCurrentExam(getExamById(examId));
    setIsQuestionModalOpen(true);
  };

  // Function to test API connection
  const handleTestConnection = async () => {
    try {
      setIsTestingConnection(true);
      const { checkApiConnection } = await import("@/lib/api");
      const result = await checkApiConnection();

      if (result.online) {
        showNotification(
          "API connection successful! Try reloading the page.",
          "success"
        );
        setIsOfflineMode(false);
      } else {
        showNotification("API still unavailable. Using sample data.", "info");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      showNotification("Error testing connection", "error");
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Function to handle viewing responses for an exam
  const handleViewResponses = (examId) => {
    setCurrentExam(getExamById(examId));
    setIsResponsePanelOpen(true);
  };

  const toggleExamList = () => {
    setShowAllExams(!showAllExams);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOrder("date-desc");
  };

  // Main render for the admin exam panel
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exam Management</h2>
          <p className="text-muted-foreground">
            Create, manage and evaluate exams for your coding club members.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowExamFormModal(true)}
            variant="default"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Exam
          </Button>
          <Button onClick={toggleExamList} variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            {showAllExams ? "Show Active Exams" : "Show All Exams"}
          </Button>
          <Button
            onClick={() => setShowUploadResultsModal(true)}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Results
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {
                  exams.filter((exam) => new Date(exam.date) > new Date())
                    .length
                }{" "}
                upcoming
              </p>
              <div className="flex items-center text-xs font-medium text-green-600">
                <BarChart className="h-3 w-3 mr-1" />
                {
                  exams.filter((exam) => exam.status === "completed").length
                }{" "}
                completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">Across all exams</p>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-600 border-green-200"
              >
                Good
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participation Rate
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                Of enrolled students
              </p>
              <div className="flex items-center text-xs font-medium text-amber-600">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                +5% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Evaluations
            </CardTitle>
            <ClipboardCheckIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                Responses to grade
              </p>
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-600 border-amber-200"
              >
                Requires Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:max-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Button variant="ghost" onClick={resetFilters} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="exams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="exams" className="space-y-6">
          {/* Existing exam list content */}
          {isResponsePanelOpen && currentExam ? (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Responses for: {currentExam.title}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => setIsResponsePanelOpen(false)}
                >
                  Back to Exams
                </Button>
              </div>
              <ExamResponsesPanel examId={currentExam.id} />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                  title="Total Exams"
                  value={examStats.total}
                  icon={<FileText className="h-5 w-5 text-indigo-500" />}
                  bgColor="bg-indigo-50"
                  textColor="text-indigo-700"
                />
                <StatCard
                  title="Published"
                  value={examStats.published}
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />
                <StatCard
                  title="Draft"
                  value={examStats.draft}
                  icon={<Edit className="h-5 w-5 text-amber-500" />}
                  bgColor="bg-amber-50"
                  textColor="text-amber-700"
                />
                <StatCard
                  title="Closed"
                  value={examStats.closed}
                  icon={<Lock className="h-5 w-5 text-slate-500" />}
                  bgColor="bg-slate-100"
                  textColor="text-slate-700"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center my-16 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
                  <p className="text-slate-500">Loading exams...</p>
                </div>
              ) : filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExams.map((exam) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onEdit={() => handleEditExam(exam.id)}
                      onAddQuestions={() => handleAddQuestions(exam.id)}
                      onDelete={() => {
                        setCurrentExam(getExamById(exam.id));
                        setIsDeleteModalOpen(true);
                      }}
                      onViewResponses={() => handleViewResponses(exam.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  selectedStatus={selectedStatus}
                  onCreateExam={() => {
                    setCurrentExam(null);
                    setIsExamModalOpen(true);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteExam}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? This action cannot be undone and will also remove all associated questions and responses."
      />

      <ExamFormModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSave={async (examData) => {
          try {
            // Format the data for the API
            const formattedData = {
              title: examData.title,
              description: examData.description,
              date: new Date(examData.date).toISOString(),
              timeLimit: examData.timeLimit,
              status: examData.status,
              isExam: true, // Mark this as an exam
              category: "exam", // Set category to exam
              examDetails: {
                passingScore: examData.passingScore,
                randomizeQuestions: examData.randomizeQuestions,
                showResultsImmediately: examData.showResultsImmediately,
                allowedAttempts: examData.allowedAttempts,
                examType: examData.examType,
                instructions: examData.instructions,
                duration: examData.timeLimit, // Set duration from timeLimit
              },
            };

            if (currentExam) {
              // Update existing exam
              const response = await updateExam(currentExam.id, formattedData);

              if (response.success) {
                dispatch({
                  type: "UPDATE_EXAM",
                  payload: {
                    id: currentExam.id,
                    ...examData,
                    updatedAt: new Date().toISOString(),
                  },
                });
                if (typeof showNotification === "function") {
                  showNotification("Exam updated successfully", "success");
                }
              } else {
                throw new Error(response.error || "Failed to update exam");
              }
            } else {
              // Create new exam
              const response = await createExam(formattedData);

              if (response.success) {
                const newExam = {
                  id: response.data._id || Date.now().toString(),
                  ...examData,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  questionCount: 0,
                  responseCount: 0,
                };
                dispatch({
                  type: "ADD_EXAM",
                  payload: newExam,
                });
                if (typeof showNotification === "function") {
                  showNotification("Exam created successfully", "success");
                }
              } else {
                throw new Error(response.error || "Failed to create exam");
              }
            }
            setIsExamModalOpen(false);
          } catch (error) {
            console.error("Error saving exam:", error);
            if (typeof showNotification === "function") {
              showNotification(`Error: ${error.message}`, "error");
            }
          }
        }}
        exam={currentExam}
      />

      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={(questions) => {
          if (currentExam) {
            // Update exam with new questions count
            dispatch({
              type: "UPDATE_EXAM",
              payload: {
                id: currentExam.id,
                questionCount: questions.length,
                updatedAt: new Date().toISOString(),
              },
            });
            if (typeof showNotification === "function") {
              showNotification(
                `${questions.length} questions saved successfully`,
                "success"
              );
            }
          }
          setIsQuestionModalOpen(false);
        }}
        exam={currentExam}
      />
    </div>
  );
}

// Stat card component
const StatCard = ({ title, value, icon, bgColor, textColor }) => (
  <Card className="border-slate-200 shadow-sm overflow-hidden">
    <div className={`p-1 ${bgColor}`} />
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} mt-1`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

// Exam card component
const ExamCard = ({
  exam,
  onEdit,
  onAddQuestions,
  onDelete,
  onViewResponses,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "outline";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-1">
              {exam.title}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 line-clamp-2">
              {exam.description}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(exam.status)} className="capitalize">
            {exam.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-slate-400" />
            <span>{exam.timeLimit} minutes</span>
          </div>
          <div className="flex items-center">
            <FileText className="mr-1 h-4 w-4 text-slate-400" />
            <span>{exam.questionCount} questions</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Created: {new Date(exam.createdAt).toLocaleDateString()}
            </span>
            <span>{exam.responseCount} responses</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-slate-50 flex justify-between">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs px-2"
          onClick={onViewResponses}
        >
          <Users className="h-3 w-3 mr-1" /> Responses
        </Button>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={onAddQuestions}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Empty state component
const EmptyState = ({ searchQuery, selectedStatus, onCreateExam }) => (
  <div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <Search className="h-8 w-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-medium text-slate-800 mb-2">No exams found</h3>
    {searchQuery || selectedStatus !== "all" ? (
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        No exams match your current filters. Try adjusting your search or filter
        criteria.
      </p>
    ) : (
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        Get started by creating your first exam. You'll be able to add questions
        and share it with students.
      </p>
    )}
    <Button
      onClick={onCreateExam}
      variant="default"
      size="default"
      className="px-4 py-2"
    >
      <Plus className="mr-2 h-4 w-4" /> Create Exam
    </Button>
  </div>
);
