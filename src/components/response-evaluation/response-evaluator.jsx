import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ResponseEvaluator({ responseId, onSave, onNext, onPrevious }) {
  const { state, evaluateResponse } = useExamContext();
  const [activeTab, setActiveTab] = useState("evaluation");
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(undefined);
  const [status, setStatus] = useState("pending");

  // Mock response and question for demonstration
  const mockResponse = {
    id: responseId,
    userId: "ST001",
    userName: "John Doe",
    examId: 1,
    questionId: 1,
    answer: "A programming language",
    isCorrect: true,
    earnedPoints: 5,
    timeSpent: 45,
    submittedAt: "2025-03-05 14:30",
    status: "pending",
  };

  const mockQuestion = {
    id: 1,
    examId: 1,
    questionText: "What is JavaScript?",
    questionType: "multiple-choice",
    options: [
      "A programming language",
      "A markup language",
      "A database system",
      "An operating system",
    ],
    correctAnswer: "A programming language",
    points: 5,
  };

  // In a real implementation, we would get these from the context
  const response = mockResponse;
  const question = mockQuestion;

  const handleSave = () => {
    evaluateResponse(responseId, {
      earnedPoints,
      feedback,
      isCorrect,
      status,
      evaluatedBy: "Admin",
    });
    onSave();
  };

  const handleMarkCorrect = () => {
    setIsCorrect(true);
    setEarnedPoints(question.points);
  };

  const handleMarkIncorrect = () => {
    setIsCorrect(false);
    setEarnedPoints(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderCorrectAnswer = () => {
    if (!question.correctAnswer) return "Not specified";

    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.join(", ");
    }

    return question.correctAnswer;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Response Evaluation</CardTitle>
            <CardDescription>
              {response.userName} ({response.userId}) - Submitted{" "}
              {new Date(response.submittedAt).toLocaleString()}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              status === "pending"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : status === "graded"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : status === "approved"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Question</h3>
              <div className="p-3 bg-muted rounded-md">
                {question.questionText}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium mb-2">Student's Answer</h4>
                  <div className="p-3 bg-muted rounded-md">
                    {response.answer || "No answer provided"}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Correct Answer</h4>
                  <div className="p-3 bg-muted rounded-md">
                    {renderCorrectAnswer()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-sm text-muted-foreground">
                    Question Type
                  </span>
                  <span className="font-medium capitalize">
                    {question.questionType.replace("-", " ")}
                  </span>
                </div>

                <div className="flex flex-col p-3 border rounded-md">
                  <span className="text-sm text-muted-foreground">
                    Time Spent
                  </span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">
                      {formatTime(response.timeSpent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Evaluation</h3>

              <div className="flex space-x-2">
                <Button
                  variant={isCorrect === true ? "default" : "outline"}
                  onClick={handleMarkCorrect}
                  className={
                    isCorrect === true ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Correct
                </Button>

                <Button
                  variant={isCorrect === false ? "default" : "outline"}
                  onClick={handleMarkIncorrect}
                  className={
                    isCorrect === false ? "bg-red-600 hover:bg-red-700" : ""
                  }
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Incorrect
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    Points ({earnedPoints}/{question.points})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((earnedPoints / question.points) * 100)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={question.points}
                  step={1}
                  value={[earnedPoints]}
                  onValueChange={(value) => setEarnedPoints(value[0])}
                />
                <Progress
                  value={(earnedPoints / question.points) * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <span>Feedback</span>
                <Textarea
                  placeholder="Provide feedback on this response..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <span>Status</span>
                <div className="flex space-x-2">
                  <Button
                    variant={status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("pending")}
                    className={
                      status === "pending"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : ""
                    }
                  >
                    Pending
                  </Button>
                  <Button
                    variant={status === "graded" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("graded")}
                    className={
                      status === "graded" ? "bg-blue-600 hover:bg-blue-700" : ""
                    }
                  >
                    Graded
                  </Button>
                  <Button
                    variant={status === "approved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("approved")}
                    className={
                      status === "approved"
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    Approved
                  </Button>
                  <Button
                    variant={status === "rejected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatus("rejected")}
                    className={
                      status === "rejected" ? "bg-red-600 hover:bg-red-700" : ""
                    }
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">Automated Feedback</h3>
                <p className="text-muted-foreground">
                  {isCorrect === true
                    ? "The answer is correct. Good job!"
                    : isCorrect === false
                    ? "The answer is incorrect. Please review the material."
                    : "No evaluation has been made yet."}
                </p>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">
                  Instructor Feedback
                </h3>
                <Textarea
                  placeholder="Provide detailed feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {onPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          )}
          {onNext && (
            <Button variant="outline" onClick={onNext}>
              Next
            </Button>
          )}
        </div>
        <Button onClick={handleSave}>Save Evaluation</Button>
      </CardFooter>
    </Card>
  );
}
