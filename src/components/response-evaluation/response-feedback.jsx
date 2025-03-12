import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  HelpCircle,
} from "lucide-react";

export function ResponseFeedback({ response, question }) {
  const isCorrect = response.isCorrect;
  const confidenceLevel = response.confidenceLevel || 3;
  const timeSpent = response.timeSpent;

  // Calculate time efficiency
  const averageTimeExpected = 30; // seconds per question, adjust as needed
  const timeEfficiency = Math.min(averageTimeExpected / timeSpent, 2); // Cap at 2x efficiency

  // Generate feedback based on correctness, confidence, and time
  const getFeedbackMessage = () => {
    if (isCorrect) {
      if (confidenceLevel >= 4 && timeEfficiency >= 1) {
        return "Excellent work! You answered correctly with high confidence and good time management.";
      }
      if (confidenceLevel >= 4) {
        return "Good job! You answered correctly with high confidence, though you could improve your speed.";
      }
      if (timeEfficiency >= 1) {
        return "Well done! You answered correctly and quickly, but try to be more confident in your knowledge.";
      }
      if (confidenceLevel <= 2) {
        return "You got the right answer, but your confidence was low. Trust your knowledge more!";
      }
      return "Correct answer! Keep practicing to improve both speed and confidence.";
    }

    // Incorrect answers
    if (confidenceLevel >= 4) {
      return "Your answer was incorrect, but you were very confident. Review this topic carefully to address this misconception.";
    }
    if (confidenceLevel <= 2 && timeEfficiency < 0.8) {
      return "You seemed unsure and took extra time, which suggests you need more practice with this concept.";
    }
    if (confidenceLevel <= 2) {
      return "You weren't confident, which was appropriate since the answer was incorrect. Review this topic.";
    }
    if (timeEfficiency >= 1.2) {
      return "You answered quickly but incorrectly. Slow down and double-check your work.";
    }
    return "Your answer was incorrect. Review this topic and try again.";
  };

  // Generate explanation based on question type
  const getExplanation = () => {
    if (!question.explanation) {
      return "No detailed explanation available for this question.";
    }

    return question.explanation;
  };

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-start gap-4">
        {isCorrect ? (
          <CheckCircle className="h-8 w-8 text-green-500 mt-1" />
        ) : (
          <XCircle className="h-8 w-8 text-red-500 mt-1" />
        )}

        <div>
          <h3 className="text-lg font-medium">
            {isCorrect ? "Correct Answer" : "Incorrect Answer"}
          </h3>
          <p className="text-muted-foreground">{getFeedbackMessage()}</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Explanation</h4>
          <p>{getExplanation()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-blue-500 mb-2" />
            <h4 className="font-medium">Time Spent</h4>
            <p className="text-2xl font-bold">{formatTime(timeSpent)}</p>
            <p className="text-sm text-muted-foreground">
              {timeEfficiency >= 1.2
                ? "Faster than average"
                : timeEfficiency <= 0.8
                ? "Slower than average"
                : "Average time"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <HelpCircle className="h-8 w-8 text-purple-500 mb-2" />
            <h4 className="font-medium">Confidence Level</h4>
            <p className="text-2xl font-bold">{confidenceLevel}/5</p>
            <p className="text-sm text-muted-foreground">
              {confidenceLevel >= 4
                ? "High confidence"
                : confidenceLevel <= 2
                ? "Low confidence"
                : "Moderate confidence"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <h4 className="font-medium">Points Earned</h4>
            <p className="text-2xl font-bold">
              {response.earnedPoints || 0}/{question.points}
            </p>
            <p className="text-sm text-muted-foreground">
              {((response.earnedPoints || 0) / question.points) * 100}% of
              available points
            </p>
          </CardContent>
        </Card>
      </div>

      {response.feedback && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Instructor Feedback</h4>
            <p>{response.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
