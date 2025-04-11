import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { examService } from "@/services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function ExamResultsModal({ isOpen, onClose, exam }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  useEffect(() => {
    const fetchExamResult = async () => {
      if (!isOpen || !exam || !exam.resultId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch the detailed result using the stored resultId
        const response = await examService.getExamResult(
          exam._id || exam.id,
          exam.resultId
        );

        if (response.success) {
          setResult(response.data);

          // Process answers into a format for display
          if (response.data.answers && response.data.answers.length > 0) {
            const processedResults = response.data.answers.map((answer) => ({
              id: answer._id || answer.question?._id,
              questionText:
                answer.question?.questionText || "Question not available",
              questionType: answer.question?.questionType || "unknown",
              userAnswer: Array.isArray(answer.answerGiven)
                ? answer.answerGiven.join(", ")
                : answer.answerGiven || "No answer provided",
              correctAnswer:
                answer.question?.correctAnswer ||
                (answer.question?.correctOption
                  ? answer.question.options?.find(
                      (o) => o.text === answer.question.correctOption
                    )?.text
                  : "Not available"),
              isCorrect: answer.isCorrect,
              points: answer.question?.points || 1,
              earnedPoints: answer.pointsAwarded || 0,
              feedback: answer.feedback,
            }));

            setQuestionResults(processedResults);
          }
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

    fetchExamResult();
  }, [isOpen, exam]);

  if (!exam) return null;

  // Calculate totals from question results
  const totalPoints = questionResults.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = questionResults.reduce(
    (sum, q) => sum + q.earnedPoints,
    0
  );
  const correctAnswers = questionResults.filter((q) => q.isCorrect).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Results: {exam.title}</DialogTitle>
          <DialogDescription>{exam.description}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading exam results...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-muted-foreground mt-2">Please try again later</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">
                    Your Score: {result?.percentageScore || exam.score}%
                  </div>
                  {result?.passed || exam.passed ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Passed
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Failed
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Score: {result?.percentageScore || exam.score}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Passing: {result?.passingScore || exam.passingScore || 40}
                      %
                    </span>
                  </div>
                  <Progress
                    value={result?.percentageScore || exam.score}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Points</div>
                    <div className="text-lg font-medium">
                      {earnedPoints} / {totalPoints}
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">
                      Correct Answers
                    </div>
                    <div className="text-lg font-medium">
                      {correctAnswers} / {questionResults.length}
                    </div>
                  </div>
                </div>

                {result?.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                    <h4 className="font-medium mb-1">Feedback</h4>
                    <p>{result.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Questions</TabsTrigger>
                <TabsTrigger value="correct">
                  Correct ({correctAnswers})
                </TabsTrigger>
                <TabsTrigger value="incorrect">
                  Incorrect ({questionResults.length - correctAnswers})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-4">
                {questionResults.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">
                          {question.questionText}
                        </div>
                        <div className="flex items-center">
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span className="ml-2 text-sm">
                            {question.earnedPoints} / {question.points} pts
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Your Answer: </span>
                          <span
                            className={
                              question.isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {question.userAnswer}
                          </span>
                        </div>
                        {!question.isCorrect && (
                          <div>
                            <span className="font-medium">
                              Correct Answer:{" "}
                            </span>
                            <span className="text-green-600">
                              {question.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="correct" className="mt-4 space-y-4">
                {questionResults
                  .filter((q) => q.isCorrect)
                  .map((question) => (
                    <Card key={question.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {question.questionText}
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="ml-2 text-sm">
                              {question.earnedPoints} / {question.points} pts
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Your Answer: </span>
                            <span className="text-green-600">
                              {question.userAnswer}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="incorrect" className="mt-4 space-y-4">
                {questionResults
                  .filter((q) => !q.isCorrect)
                  .map((question) => (
                    <Card key={question.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {question.questionText}
                          </div>
                          <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="ml-2 text-sm">
                              {question.earnedPoints} / {question.points} pts
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Your Answer: </span>
                            <span className="text-red-600">
                              {question.userAnswer}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Correct Answer:{" "}
                            </span>
                            <span className="text-green-600">
                              {question.correctAnswer}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {exam.resultId && (
            <Button
              onClick={() =>
                window.open(
                  `/exams/${exam._id || exam.id}/results/${exam.resultId}`,
                  "_blank"
                )
              }
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Detailed Results
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
