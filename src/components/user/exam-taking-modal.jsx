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
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  Shield,
  Fullscreen,
} from "lucide-react";
import { useExamIntegrity } from "@/components/exam-integrity/exam-integrity-provider";
import { ExamIntegrityProvider } from "@/components/exam-integrity/exam-integrity-provider";
import { Badge } from "@/components/ui/badge";

export function ExamTakingModal({ isOpen, onClose, onSubmit, exam }) {
  return (
    <ExamIntegrityProvider
      onForceSubmit={() => {
        if (isOpen && exam) {
          // If forced submission, we pass a special flag in the response
          onSubmit({
            examId: exam.id,
            answers: {},
            integrityReport: {
              forcedSubmission: true,
              reason: "integrity_violation",
            },
          });
          onClose();
        }
      }}
      onIntegrityViolation={(data) => console.log("Integrity violation:", data)}
      examId={exam?.id || "unknown-exam"}
      allowAccessibilityExceptions={false}
    >
      <ExamTakingContent
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        exam={exam}
      />
    </ExamIntegrityProvider>
  );
}

function ExamTakingContent({ isOpen, onClose, onSubmit, exam }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Get exam integrity features
  const {
    startIntegrityMode,
    deactivateIntegrityMode,
    isIntegrityModeActive,
    focusViolations,
    fullscreenViolations,
    examContainerRef,
    isFullscreen,
  } = useExamIntegrity();

  // Mock questions for the exam (or use exam.questions if available)
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

  // Initialize exam when it opens
  useEffect(() => {
    if (isOpen && exam) {
      // Set up exam questions from the exam prop
      if (exam.questions && exam.questions.length > 0) {
        setQuestions(exam.questions);
      }

      // Initialize answers object
      const initialAnswers = {};
      for (const q of questions) {
        initialAnswers[q.id] = "";
      }
      setAnswers(initialAnswers);

      // Set up timer
      const timeLimit = exam?.timeLimit || 60; // default to 60 minutes if not specified
      setTimeRemaining(timeLimit * 60); // convert to seconds
    }

    // Clean up when modal closes
    return () => {
      if (isIntegrityModeActive) {
        deactivateIntegrityMode();
      }
      setExamStarted(false);
    };
  }, [isOpen, exam, deactivateIntegrityMode, isIntegrityModeActive, questions]);

  // Timer countdown - only start when exam is started
  useEffect(() => {
    let timer = null;

    if (isOpen && examStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time's up - force submit
            setIsTimeUpDialogOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isOpen, timeRemaining, examStarted]);

  // Handle starting the exam - this should be called directly from user interaction
  const handleStartExam = () => {
    startIntegrityMode();
    // Call the fullscreen request directly from the user event
    if (examContainerRef.current) {
      examContainerRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
    setExamStarted(true);
  };

  // Handle normal exam submission
  const handleSubmitExam = () => {
    setIsSubmitDialogOpen(false);

    // Submit the exam with the integrity report
    const submissionData = {
      examId: exam?.id,
      answers,
      integrityReport: {
        focusViolations,
        fullscreenViolations,
        completionTime: exam?.timeLimit * 60 - timeRemaining,
        submittedBy: "user",
      },
    };

    onSubmit(submissionData);
    deactivateIntegrityMode();
    onClose();
  };

  const handleAnswerChange = (value) => {
    if (currentQuestionIndex < questions.length) {
      const questionId = questions[currentQuestionIndex].id;
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    }
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEnterFullscreen = () => {
    // This function is called directly from a user action (button click)
    if (examContainerRef.current) {
      examContainerRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  };

  if (!exam || !isOpen) return null;

  // Show exam start screen if not started
  if (!examStarted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              {exam?.title || "Exam"} Ready
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              <p>
                You are about to start an exam that will last{" "}
                {exam?.timeLimit || 60} minutes. This exam requires:
              </p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Fullscreen mode to be enabled</li>
                <li>Your focus to remain on this window</li>
                <li>No switching between applications</li>
              </ul>
              <p className="mt-2">
                When you're ready to begin, click "Start Exam" below.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              size="default"
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartExam}
              variant="default"
              size="default"
              className="bg-primary px-4 py-2"
            >
              Start Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto"
          ref={examContainerRef}
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby="exam-content-description"
        >
          <DialogHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold">
                {exam?.title || "Exam"}
                {isIntegrityModeActive && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs bg-green-50 text-green-700"
                  >
                    Secure Mode
                  </Badge>
                )}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                {!isFullscreen && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEnterFullscreen}
                    className="h-8 w-8"
                  >
                    <Fullscreen className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <DialogDescription
              id="exam-content-description"
              className="text-sm text-muted-foreground"
            >
              {exam?.description || "Complete all questions before submitting."}
              {(focusViolations > 0 || fullscreenViolations > 0) && (
                <div className="mt-2 text-amber-600 text-sm flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Integrity violations detected:{" "}
                  {focusViolations + fullscreenViolations}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Time display - restore the timer */}
          <div className="flex justify-end mb-4">
            <div className="text-orange-600 font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress bar */}
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            className="h-2 mb-4"
          />

          {/* Current question */}
          <div className="my-4">
            <h3 className="text-lg font-medium mb-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <p className="mb-4">
                  {questions[currentQuestionIndex]?.questionText ||
                    "Question text not available"}
                </p>

                {questions[currentQuestionIndex]?.questionType ===
                "multiple-choice" ? (
                  <RadioGroup
                    className="space-y-2"
                    value={answers[questions[currentQuestionIndex]?.id] || ""}
                    onValueChange={(value) => handleAnswerChange(value)}
                  >
                    {questions[currentQuestionIndex]?.options?.map(
                      (option, i) => (
                        <div
                          key={`option-${questions[currentQuestionIndex]?.id}-${i}`}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <RadioGroupItem
                            className="text-primary"
                            value={option}
                            id={`option-${questions[currentQuestionIndex]?.id}-${i}`}
                          />
                          <Label
                            className="cursor-pointer"
                            htmlFor={`option-${questions[currentQuestionIndex]?.id}-${i}`}
                          >
                            {option}
                          </Label>
                        </div>
                      )
                    )}
                  </RadioGroup>
                ) : (
                  <Textarea
                    placeholder="Type your answer here..."
                    value={answers[questions[currentQuestionIndex]?.id] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-[150px]"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2"
              size="default"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                className="px-4 py-2"
                variant="default"
                size="default"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => setIsSubmitDialogOpen(true)}
                className="px-4 py-2"
                size="default"
              >
                Submit Exam
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit confirmation dialog */}
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-lg">
              Submit Exam?
            </AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              Are you sure you want to submit your exam? This action cannot be
              undone.
              {(focusViolations > 0 || fullscreenViolations > 0) && (
                <div className="mt-2 text-amber-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>
                    Note: {focusViolations + fullscreenViolations} integrity
                    violations were detected during your exam session.
                  </span>
                </div>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitExam}
              className="bg-primary hover:bg-primary/90"
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time's up dialog */}
      <AlertDialog
        open={isTimeUpDialogOpen}
        onOpenChange={setIsTimeUpDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <AlertDialogTitle className="text-lg">
                Time's Up!
              </AlertDialogTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Your exam time has expired. Your answers will be submitted
              automatically.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={handleSubmitExam}
              className="bg-primary hover:bg-primary/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
