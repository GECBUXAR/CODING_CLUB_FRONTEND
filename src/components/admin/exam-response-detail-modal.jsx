import React, { useState, useEffect } from "react";
import { useResponseEvaluation } from "@/contexts/optimized-response-evaluation-context";
import ResponseQuestionEvaluator from "./response-question-evaluator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  AlertTriangle,
  BarChart2,
  ClipboardCheck,
  MessageSquare,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ExamResponseDetailModal = ({ isOpen, onClose, examId, responseId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    getResponse,
    loading,
    fetchResponseDetails,
    submitEvaluation,
    getEvaluation,
  } = useResponseEvaluation();

  // Get response data
  const responseData = getResponse(examId, responseId);

  // Fetch response data when modal opens
  useEffect(() => {
    if (isOpen && examId && responseId) {
      fetchResponseDetails(examId, responseId);
    }
  }, [isOpen, examId, responseId, fetchResponseDetails]);

  // Update feedback and score when response data changes
  useEffect(() => {
    if (responseData) {
      setGeneralFeedback(responseData.feedback || "");
      setOverallScore(responseData.finalScore || 0);
    }
  }, [responseData]);

  // Handle saving overall feedback and score
  const handleSaveOverall = async () => {
    try {
      setSaveLoading(true);
      // Create evaluation data for overall score
      const evaluationData = {
        finalScore: overallScore,
        feedback: generalFeedback,
        status: "evaluated",
        evaluatedAt: new Date().toISOString(),
      };

      // Submit overall evaluation
      await submitEvaluation(examId, responseId, "overall", evaluationData);
      setSaveLoading(false);
    } catch (error) {
      console.error("Error saving overall evaluation:", error);
      setSaveLoading(false);
    }
  };

  // Calculate progress based on evaluated questions
  const calculateProgress = () => {
    if (
      !responseData ||
      !responseData.questions ||
      responseData.questions.length === 0
    ) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    const totalQuestions = responseData.questions.length;
    const evaluatedQuestions = responseData.questions.filter((q) =>
      getEvaluation(examId, responseId, q.id)
    ).length;

    const percentage = Math.round((evaluatedQuestions / totalQuestions) * 100);
    const completed = evaluatedQuestions;
    const total = totalQuestions;

    return { percentage, completed, total };
  };

  const calculateOverallScore = () => {
    if (
      !responseData ||
      !responseData.questions ||
      responseData.questions.length === 0
    ) {
      return 0;
    }

    const evaluatedQuestions = responseData.questions.filter(
      (q) => q.evaluation
    );
    if (evaluatedQuestions.length === 0) return 0;

    const totalScore = evaluatedQuestions.reduce(
      (sum, q) => sum + (q.evaluation.score || 0),
      0
    );
    const maxPossibleScore = evaluatedQuestions.reduce(
      (sum, q) => sum + (q.maxScore || 10),
      0
    );

    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  // Handle individual question evaluation complete
  const handleQuestionEvaluated = (questionId, evaluation) => {
    // When a question is evaluated, we might want to update the UI,
    // or move to the next question automatically
    const currentIndex =
      responseData?.questions.findIndex((q) => q.id === questionId) || 0;
    if (currentIndex < responseData?.questions.length - 1) {
      setActiveQuestionIndex(currentIndex + 1);
    }
  };

  if (!isOpen) return null;

  // Loading state
  if (loading || !responseData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Loading Response Details...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Determine the current active question
  const activeQuestion = responseData.questions?.[activeQuestionIndex] || null;

  // Get student info
  const student = responseData.student || {
    name: "Anonymous",
    email: "No email provided",
  };

  // Calculate evaluation progress
  const evaluationProgress = calculateProgress();

  const modalContent = (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <div className="px-6 border-b border-slate-200">
          <TabsList className="h-12">
            <TabsTrigger value="overview" className="flex items-center text-sm">
              <BarChart2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="flex items-center text-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="flex items-center text-sm"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Evaluation
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center text-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="p-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 rounded-full p-3 mr-4">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {responseData?.studentName || "Anonymous Student"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        ID: {responseData?.studentId || "N/A"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Submitted</p>
                      <p className="text-sm font-medium text-slate-800">
                        {responseData?.submittedAt
                          ? new Date(responseData.submittedAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Time Spent</p>
                      <p className="text-sm font-medium text-slate-800">
                        {responseData?.timeSpent
                          ? `${Math.floor(responseData.timeSpent / 60)}m ${
                              responseData.timeSpent % 60
                            }s`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Response Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-500 mb-1">Score</p>
                      <div className="flex items-center justify-center">
                        <p className="text-2xl font-bold text-slate-800">
                          {calculateOverallScore()}%
                        </p>
                        <Badge
                          variant={
                            calculateOverallScore() >= 70
                              ? "success"
                              : "destructive"
                          }
                          className="ml-2"
                        >
                          {calculateOverallScore() >= 70 ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-500 mb-1">Questions</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-bold text-slate-800">
                          {evaluationProgress.completed}
                        </p>
                        <p className="text-sm text-slate-500">
                          / {evaluationProgress.total} evaluated
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <p className="text-slate-600">Evaluation Progress</p>
                      <p className="text-slate-800 font-medium">
                        {evaluationProgress.percentage}%
                      </p>
                    </div>
                    <Progress
                      value={evaluationProgress.percentage}
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2">
                    <Textarea
                      placeholder="Add overall feedback for this student..."
                      value={generalFeedback}
                      onChange={(e) => setGeneralFeedback(e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveOverall}
                        disabled={saveLoading}
                      >
                        {saveLoading ? (
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                            Saving...
                          </span>
                        ) : (
                          "Save Feedback"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm md:col-span-2">
                <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Question Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-slate-200 border-t border-slate-200">
                    {responseData?.questions?.map((question, idx) => {
                      const evaluation = getEvaluation(
                        examId,
                        responseId,
                        question.id
                      );
                      const score = evaluation?.score || 0;
                      const maxScore = question.maxScore || 10;
                      const percentage =
                        maxScore > 0 ? (score / maxScore) * 100 : 0;

                      return (
                        <div key={question.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-slate-700">
                              Question {idx + 1}
                            </p>
                            <Badge
                              variant={
                                percentage >= 70
                                  ? "success"
                                  : percentage >= 40
                                  ? "warning"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {Math.round(percentage)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                            {question.questionText}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                              setActiveQuestionIndex(idx);
                              setActiveTab("questions");
                            }}
                          >
                            {evaluation ? "Review Evaluation" : "Evaluate"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="p-6 mt-0">
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar with question list */}
              <Card className="col-span-12 md:col-span-3 border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-slate-200">
                      {responseData?.questions?.map((question, idx) => {
                        const evaluation = getEvaluation(
                          examId,
                          responseId,
                          question.id
                        );
                        const isActive = idx === activeQuestionIndex;

                        return (
                          <div
                            key={question.id}
                            className={cn(
                              "flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors",
                              isActive && "bg-slate-100"
                            )}
                            onClick={() => setActiveQuestionIndex(idx)}
                          >
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "h-6 w-6 rounded-full flex items-center justify-center text-xs mr-3",
                                  isActive
                                    ? "bg-primary text-white"
                                    : "bg-slate-200 text-slate-600"
                                )}
                              >
                                {idx + 1}
                              </div>
                              <p className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                                {question.questionType === "multiple-choice"
                                  ? "Multiple Choice"
                                  : "Essay Question"}
                              </p>
                            </div>
                            {evaluation ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Question evaluation area */}
              <div className="col-span-12 md:col-span-9">
                {responseData?.questions &&
                  activeQuestionIndex < responseData.questions.length && (
                    <ResponseQuestionEvaluator
                      examId={examId}
                      responseId={responseId}
                      questionId={
                        responseData.questions[activeQuestionIndex].id
                      }
                      studentAnswer={
                        responseData.questions[activeQuestionIndex]
                          .studentAnswer
                      }
                      questionText={
                        responseData.questions[activeQuestionIndex].questionText
                      }
                      questionType={
                        responseData.questions[activeQuestionIndex].questionType
                      }
                      correctAnswer={
                        responseData.questions[activeQuestionIndex]
                          .correctAnswer
                      }
                      maxScore={
                        responseData.questions[activeQuestionIndex].maxScore ||
                        10
                      }
                      onEvaluationComplete={handleQuestionEvaluated}
                    />
                  )}

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (activeQuestionIndex > 0) {
                        setActiveQuestionIndex(activeQuestionIndex - 1);
                      }
                    }}
                    disabled={activeQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (
                        responseData?.questions &&
                        activeQuestionIndex < responseData.questions.length - 1
                      ) {
                        setActiveQuestionIndex(activeQuestionIndex + 1);
                      }
                    }}
                    disabled={
                      !responseData?.questions ||
                      activeQuestionIndex >= responseData.questions.length - 1
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evaluation" className="p-6 mt-0">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Evaluation Summary
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={handleSaveOverall}
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Saving..." : "Save Evaluation"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Overall Score
                      </h3>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-slate-800">
                          {calculateOverallScore()}%
                        </span>
                        <Badge
                          variant={
                            calculateOverallScore() >= 70
                              ? "success"
                              : "destructive"
                          }
                          className="ml-2"
                        >
                          {calculateOverallScore() >= 70 ? "Pass" : "Fail"}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Completion Rate
                      </h3>
                      <div className="text-3xl font-bold text-slate-800">
                        {evaluationProgress.percentage}%
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-600 mb-2">
                        Time Efficiency
                      </h3>
                      <div className="text-3xl font-bold text-slate-800">
                        {responseData?.timeEfficiency || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      General Feedback
                    </h3>
                    <Textarea
                      placeholder="Provide overall feedback on the student's performance..."
                      value={generalFeedback}
                      onChange={(e) => setGeneralFeedback(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      Question Scores
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Question
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Score
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {responseData?.questions?.map((question, idx) => {
                            const evaluation = getEvaluation(
                              examId,
                              responseId,
                              question.id
                            );
                            return (
                              <tr key={question.id}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="bg-slate-100 rounded-full h-6 w-6 flex items-center justify-center text-xs mr-2">
                                      {idx + 1}
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">
                                      {question.questionText.substring(0, 30)}
                                      ...
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {evaluation ? (
                                    <Badge
                                      variant={
                                        evaluation.score >= 7
                                          ? "success"
                                          : evaluation.score >= 4
                                          ? "warning"
                                          : "destructive"
                                      }
                                    >
                                      {evaluation.score}/
                                      {question.maxScore || 10}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">
                                      Not Evaluated
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {evaluation ? (
                                    <span className="text-green-600 flex items-center text-sm">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 flex items-center text-sm">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      Pending
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setActiveQuestionIndex(idx);
                                      setActiveTab("questions");
                                    }}
                                  >
                                    {evaluation ? (
                                      <Eye className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <Edit className="h-4 w-4 text-amber-600" />
                                    )}
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="p-6 mt-0">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 rounded-t-lg p-4">
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Student Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      General Feedback
                    </h3>
                    <Textarea
                      placeholder="Provide feedback that will be visible to the student..."
                      value={generalFeedback}
                      onChange={(e) => setGeneralFeedback(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      Question-specific Feedback
                    </h3>

                    <div className="space-y-4">
                      {responseData?.questions?.map((question, idx) => {
                        const evaluation = getEvaluation(
                          examId,
                          responseId,
                          question.id
                        );

                        return (
                          <Card key={question.id} className="border-slate-200">
                            <CardHeader className="p-3 bg-slate-50">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-slate-700">
                                  Question {idx + 1}
                                </h4>
                                {evaluation ? (
                                  <Badge
                                    variant="outline"
                                    className="font-normal text-xs"
                                  >
                                    {evaluation.score}/{question.maxScore || 10}{" "}
                                    points
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="font-normal text-xs"
                                  >
                                    Not evaluated
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-3">
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {question.questionText}
                              </p>

                              <div className="bg-slate-50 p-3 rounded-md mb-3">
                                <p className="text-xs text-slate-500 mb-1">
                                  Student's Answer:
                                </p>
                                <p className="text-sm text-slate-700">
                                  {question.studentAnswer.substring(0, 100)}
                                  {question.studentAnswer.length > 100
                                    ? "..."
                                    : ""}
                                </p>
                              </div>

                              {evaluation?.feedback ? (
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">
                                    Your Feedback:
                                  </p>
                                  <p className="text-sm text-slate-700 p-3 bg-blue-50 rounded-md">
                                    {evaluation.feedback}
                                  </p>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={() => {
                                    setActiveQuestionIndex(idx);
                                    setActiveTab("questions");
                                  }}
                                >
                                  Provide Feedback
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveOverall} disabled={saveLoading}>
                      {saveLoading ? (
                        <span className="flex items-center">
                          <span className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                          Saving...
                        </span>
                      ) : (
                        "Save All Feedback"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <DialogFooter className="px-6 py-4 border-t border-slate-200">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="bg-slate-50 p-6 rounded-t-lg border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Student Response Details
              </DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                {responseData?.studentName || "Anonymous Student"} -{" "}
                {new Date(
                  responseData?.submittedAt || Date.now()
                ).toLocaleString()}
              </DialogDescription>
            </div>

            <div className="flex items-center space-x-2">
              {responseData?.status && (
                <Badge
                  variant={
                    responseData.status === "completed"
                      ? "success"
                      : responseData.status === "in_progress"
                      ? "warning"
                      : "default"
                  }
                  className="capitalize font-normal text-xs"
                >
                  {responseData.status.replace("_", " ")}
                </Badge>
              )}

              <div className="flex items-center bg-white px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-700">
                <Clock className="h-3 w-3 mr-1 text-slate-500" />
                <span>
                  {responseData?.timeSpent
                    ? `${Math.round(responseData.timeSpent / 60)} minutes`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">{modalContent}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamResponseDetailModal;
