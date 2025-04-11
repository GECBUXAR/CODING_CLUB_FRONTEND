import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Save } from "lucide-react";
import { toast } from "sonner";

const ExamResponseEvaluator = () => {
  const { examId, resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluations, setEvaluations] = useState({});
  const [savingAnswer, setSavingAnswer] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the enhanced exam API
        const response = await examService.getExamResultAdmin(examId, resultId);

        if (response.success) {
          setResult(response.data);
          
          // Initialize evaluations state
          const initialEvaluations = {};
          response.data.answers.forEach(answer => {
            if (answer.isCorrect === null || answer.pointsAwarded === null) {
              initialEvaluations[answer._id] = {
                pointsAwarded: answer.pointsAwarded || 0,
                feedback: answer.feedback || "",
                isCorrect: answer.isCorrect || false
              };
            }
          });
          setEvaluations(initialEvaluations);
        } else {
          setError(response.error || "Failed to fetch exam result");
        }
      } catch (err) {
        console.error("Error fetching exam result:", err);
        setError("An error occurred while fetching the exam result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, resultId]);

  const handleEvaluationChange = (answerId, field, value) => {
    setEvaluations(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }));
  };

  const handleSaveEvaluation = async (answerId) => {
    try {
      setSavingAnswer(answerId);
      const evaluation = evaluations[answerId];
      
      const response = await examService.evaluateAnswer(
        examId,
        resultId,
        answerId,
        evaluation
      );

      if (response.success) {
        // Update the result with the new evaluation
        setResult(response.data);
        
        // Remove from evaluations state since it's now saved
        const newEvaluations = { ...evaluations };
        delete newEvaluations[answerId];
        setEvaluations(newEvaluations);
        
        toast.success("Answer evaluation saved successfully");
      } else {
        toast.error(response.error || "Failed to save evaluation");
      }
    } catch (err) {
      console.error("Error saving evaluation:", err);
      toast.error("An error occurred while saving the evaluation");
    } finally {
      setSavingAnswer(null);
    }
  };

  // Get answer status icon
  const getAnswerStatusIcon = (isCorrect) => {
    if (isCorrect === null) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else if (isCorrect) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No result found
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Result Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested exam result could not be found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Filter answers that need evaluation (subjective questions)
  const pendingEvaluation = result.answers.filter(
    answer => answer.isCorrect === null || answer.pointsAwarded === null
  );

  // Filter answers that are already evaluated
  const evaluatedAnswers = result.answers.filter(
    answer => answer.isCorrect !== null && answer.pointsAwarded !== null
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Evaluate Exam Response</CardTitle>
              <CardDescription>
                {result.event?.title || "Exam"} - Submitted by {result.user?.name || "Student"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Admin View
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Submission Details</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Student:</span> {result.user?.name}
                </p>
                <p>
                  <span className="font-medium">Submitted:</span> {formatDate(result.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {result.duration
                    ? `${Math.floor(result.duration / 60)}m ${result.duration % 60}s`
                    : "Not recorded"}
                </p>
                <p>
                  <span className="font-medium">Attempt:</span> {result.attemptNumber}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Current Score</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Score:</span> {result.score} / {result.totalScore} points
                </p>
                <p>
                  <span className="font-medium">Percentage:</span> {Math.round(result.percentageScore)}%
                </p>
                <p>
                  <span className="font-medium">Grade:</span> {result.grade}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {result.passed ? "Passed" : "Failed"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending Evaluation ({pendingEvaluation.length})
          </TabsTrigger>
          <TabsTrigger value="evaluated">
            Evaluated ({evaluatedAnswers.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          {pendingEvaluation.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No answers pending evaluation. All responses have been graded.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {pendingEvaluation.map((answer, index) => (
                <AccordionItem key={answer._id} value={answer._id}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>
                        Question {index + 1}: {answer.question?.questionText?.substring(0, 50)}
                        {answer.question?.questionText?.length > 50 ? "..." : ""}
                      </span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Pending
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Question</h4>
                        <p className="mt-1">{answer.question?.questionText}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Type: {answer.question?.questionType} | 
                          Max Points: {answer.question?.points || 1}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Student's Answer</h4>
                        <div className="mt-1 rounded-md bg-muted p-3">
                          {answer.question?.questionType === "code" ? (
                            <pre className="text-sm">
                              <code>{answer.answerGiven}</code>
                            </pre>
                          ) : (
                            <p>{answer.answerGiven || "No answer provided"}</p>
                          )}
                        </div>
                      </div>
                      
                      {answer.question?.correctAnswer && (
                        <div>
                          <h4 className="font-medium">Correct Answer</h4>
                          <p className="mt-1">{answer.question.correctAnswer}</p>
                        </div>
                      )}
                      
                      <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`correct-${answer._id}`}
                            checked={evaluations[answer._id]?.isCorrect}
                            onCheckedChange={(checked) => 
                              handleEvaluationChange(answer._id, "isCorrect", checked)
                            }
                          />
                          <Label htmlFor={`correct-${answer._id}`}>Mark as correct</Label>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`points-${answer._id}`}>Points Awarded</Label>
                          <Input
                            id={`points-${answer._id}`}
                            type="number"
                            min="0"
                            max={answer.question?.points || 1}
                            value={evaluations[answer._id]?.pointsAwarded}
                            onChange={(e) => 
                              handleEvaluationChange(
                                answer._id, 
                                "pointsAwarded", 
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`feedback-${answer._id}`}>Feedback</Label>
                          <Textarea
                            id={`feedback-${answer._id}`}
                            placeholder="Provide feedback to the student"
                            value={evaluations[answer._id]?.feedback}
                            onChange={(e) => 
                              handleEvaluationChange(answer._id, "feedback", e.target.value)
                            }
                          />
                        </div>
                        
                        <Button 
                          onClick={() => handleSaveEvaluation(answer._id)}
                          disabled={savingAnswer === answer._id}
                        >
                          {savingAnswer === answer._id ? (
                            "Saving..."
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Evaluation
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        
        <TabsContent value="evaluated" className="mt-4">
          {evaluatedAnswers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No evaluated answers yet. Start grading responses from the "Pending" tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {evaluatedAnswers.map((answer, index) => (
                <AccordionItem key={answer._id} value={answer._id}>
                  <AccordionTrigger className="hover:bg-muted/50 px-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>
                        Question {index + 1}: {answer.question?.questionText?.substring(0, 50)}
                        {answer.question?.questionText?.length > 50 ? "..." : ""}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getAnswerStatusIcon(answer.isCorrect)}
                        <span className="text-sm">
                          {answer.pointsAwarded} / {answer.question?.points || 1} points
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Question</h4>
                        <p className="mt-1">{answer.question?.questionText}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Type: {answer.question?.questionType} | 
                          Max Points: {answer.question?.points || 1}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Student's Answer</h4>
                        <div className="mt-1 rounded-md bg-muted p-3">
                          {answer.question?.questionType === "code" ? (
                            <pre className="text-sm">
                              <code>{answer.answerGiven}</code>
                            </pre>
                          ) : (
                            <p>{answer.answerGiven || "No answer provided"}</p>
                          )}
                        </div>
                      </div>
                      
                      {answer.question?.correctAnswer && (
                        <div>
                          <h4 className="font-medium">Correct Answer</h4>
                          <p className="mt-1">{answer.question.correctAnswer}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Status:</span>
                          <span className="flex items-center">
                            {getAnswerStatusIcon(answer.isCorrect)}
                            <span className="ml-1">
                              {answer.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium">Points Awarded:</span>{" "}
                          {answer.pointsAwarded} / {answer.question?.points || 1}
                        </div>
                        
                        {answer.feedback && (
                          <div>
                            <span className="font-medium">Feedback:</span>
                            <p className="mt-1 text-sm">{answer.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate(`/admin/exams/${examId}/results`)}
          >
            View All Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExamResponseEvaluator;
