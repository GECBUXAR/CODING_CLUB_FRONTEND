"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, Clock, AlertTriangle } from "lucide-react";

export function ExamTakingModal({ isOpen, onClose, onSubmit, exam }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);

  // Mock questions for the exam
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: "What is JavaScript?",
      questionType: "multiple-choice",
      options: [
        "A programming language",
        "A markup language",
        "A database system",
        "An operating system",
      ],
    },
    {
      id: 2,
      questionText: "JavaScript is a statically typed language.",
      questionType: "true-false",
      options: ["True", "False"],
    },
    {
      id: 3,
      questionText: "What does DOM stand for?",
      questionType: "short-answer",
    },
    {
      id: 4,
      questionText: "Write a function that returns the sum of two numbers.",
      questionType: "code",
    },
    {
      id: 5,
      questionText: "Which of the following is NOT a JavaScript data type?",
      questionType: "multiple-choice",
      options: ["String", "Boolean", "Float", "Symbol"],
    },
  ]);

  useEffect(() => {
    if (exam && isOpen) {
      // Reset state when opening the modal
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(exam.timeLimit * 60); // Convert minutes to seconds
    }
  }, [exam, isOpen]);

  useEffect(() => {
    let timer;

    if (isOpen && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeUpDialogOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, timeRemaining]);

  const handleAnswerChange = (value) => {
    if (!questions[currentQuestionIndex]) return;

    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    onSubmit(exam.id, answers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!exam || !isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{exam.title}</DialogTitle>
            <DialogDescription>{exam.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="flex items-center text-sm font-medium">
                <Clock className="mr-1 h-4 w-4" />
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            {currentQuestion && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="font-medium">
                      {currentQuestion.questionText}
                    </div>

                    {currentQuestion.questionType === "multiple-choice" && (
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswerChange}
                      >
                        {currentQuestion.options?.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                            />
                            <Label htmlFor={`option-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {currentQuestion.questionType === "true-false" && (
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswerChange}
                      >
                        {currentQuestion.options?.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                            />
                            <Label htmlFor={`option-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {currentQuestion.questionType === "short-answer" && (
                      <Textarea
                        placeholder="Type your answer here"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                      />
                    )}

                    {currentQuestion.questionType === "code" && (
                      <Textarea
                        placeholder="Write your code here"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="font-mono h-32"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setIsSubmitDialogOpen(true)}>
                  Submit Exam
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {Object.keys(answers).length} of {questions.length} questions
              answered
            </div>
            <Button
              variant="outline"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your exam? You have answered{" "}
              {Object.keys(answers).length} out of {questions.length} questions.
              {Object.keys(answers).length < questions.length && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  You have unanswered questions.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitExam}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isTimeUpDialogOpen}
        onOpenChange={setIsTimeUpDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your time for this exam has expired. Your answers will be
              automatically submitted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmitExam}>
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
