import { useState } from "react";
import { useExamContext } from "@/contexts/optimized-exam-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { ResponseEvaluator } from "./response-evaluator";

export function ResponseManager({ examId }) {
  const { state, getExamById } = useExamContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const exam = getExamById(examId);

  // Mock responses for demonstration
  const mockResponses = [
    {
      id: 1,
      userId: "ST001",
      userName: "John Doe",
      examId: examId,
      questionId: 1,
      answer: "A programming language",
      isCorrect: true,
      earnedPoints: 5,
      timeSpent: 45,
      submittedAt: "2025-03-05 14:30",
      status: "pending",
    },
    {
      id: 2,
      userId: "ST002",
      userName: "Jane Smith",
      examId: examId,
      questionId: 2,
      answer: "True",
      isCorrect: false,
      earnedPoints: 0,
      timeSpent: 30,
      submittedAt: "2025-03-05 15:15",
      status: "graded",
    },
    {
      id: 3,
      userId: "ST003",
      userName: "Alex Johnson",
      examId: examId,
      questionId: 3,
      answer: "Document Object Model",
      isCorrect: true,
      earnedPoints: 5,
      timeSpent: 60,
      submittedAt: "2025-03-05 16:00",
      status: "approved",
    },
  ];

  const responses = mockResponses;

  // Filter responses based on search and status
  const filteredResponses = responses.filter((response) => {
    const matchesSearch =
      response.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || response.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectResponse = (responseId) => {
    setSelectedResponseId(responseId);
    setViewMode("evaluate");
  };

  const handleSaveEvaluation = () => {
    // Stay in evaluation mode, but show a success message or update UI as needed
  };

  const handleNextResponse = () => {
    if (!selectedResponseId) return;

    const currentIndex = responses.findIndex(
      (r) => r.id === selectedResponseId
    );
    if (currentIndex < responses.length - 1) {
      setSelectedResponseId(responses[currentIndex + 1].id);
    }
  };

  const handlePreviousResponse = () => {
    if (!selectedResponseId) return;

    const currentIndex = responses.findIndex(
      (r) => r.id === selectedResponseId
    );
    if (currentIndex > 0) {
      setSelectedResponseId(responses[currentIndex - 1].id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "graded":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Graded
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!exam) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p>Exam not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === "evaluate" && selectedResponseId) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setViewMode("list")}>
            Back to Response List
          </Button>

          <div className="text-sm text-muted-foreground">
            Response{" "}
            {responses.findIndex((r) => r.id === selectedResponseId) + 1} of{" "}
            {responses.length}
          </div>
        </div>

        <ResponseEvaluator
          responseId={selectedResponseId}
          onSave={handleSaveEvaluation}
          onNext={handleNextResponse}
          onPrevious={handlePreviousResponse}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{exam.title} - Response Evaluation</CardTitle>
          <CardDescription>
            Evaluate and manage student responses for this exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search responses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="graded">Graded</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No responses found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell>
                      <div className="font-medium">{response.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {response.userId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {response.answer || "No answer provided"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(response.timeSpent)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(response.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {response.isCorrect ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        )}
                        <span>
                          {response.earnedPoints} / {exam.questionPoints || 5}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSelectResponse(response.id)}
                      >
                        Evaluate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
