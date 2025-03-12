import { CheckCircle, XCircle } from "lucide-react";
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
  if (!exam) return null;

  // Mock questions and answers for the results
  const questionResults = [
    {
      id: 1,
      questionText: "What is JavaScript?",
      questionType: "multiple-choice",
      userAnswer: "A programming language",
      correctAnswer: "A programming language",
      isCorrect: true,
      points: 5,
      earnedPoints: 5,
    },
    {
      id: 2,
      questionText: "JavaScript is a statically typed language.",
      questionType: "true-false",
      userAnswer: "True",
      correctAnswer: "False",
      isCorrect: false,
      points: 3,
      earnedPoints: 0,
    },
    {
      id: 3,
      questionText: "What does DOM stand for?",
      questionType: "short-answer",
      userAnswer: "Document Object Model",
      correctAnswer: "Document Object Model",
      isCorrect: true,
      points: 5,
      earnedPoints: 5,
    },
    {
      id: 4,
      questionText: "Write a function that returns the sum of two numbers.",
      questionType: "code",
      userAnswer: "function sum(a, b) {\n  return a + b;\n}",
      correctAnswer: "function sum(a, b) {\n  return a + b;\n}",
      isCorrect: true,
      points: 10,
      earnedPoints: 10,
    },
    {
      id: 5,
      questionText: "Which of the following is NOT a JavaScript data type?",
      questionType: "multiple-choice",
      userAnswer: "Float",
      correctAnswer: "Float",
      isCorrect: true,
      points: 5,
      earnedPoints: 5,
    },
  ];

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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium">
                  Your Score: {exam.score}%
                </div>
                {exam.passed ? (
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
                    Score: {exam.score}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Passing: {exam.passingScore}%
                  </span>
                </div>
                <Progress value={exam.score} className="h-2" />
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
                      <div className="font-medium">{question.questionText}</div>
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
                          <span className="font-medium">Correct Answer: </span>
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
                          <span className="font-medium">Correct Answer: </span>
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

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
