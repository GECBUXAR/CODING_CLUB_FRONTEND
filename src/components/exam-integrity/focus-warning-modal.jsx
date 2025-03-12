import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function FocusWarningModal({ isOpen, remainingTime, onReturn }) {
  const progressValue = remainingTime !== null ? (remainingTime / 30) * 100 : 0;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDialogTitle className="text-lg">
              Warning: Focus Lost
            </AlertDialogTitle>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="leading-normal">
              You have navigated away from the exam. Please return to the exam
              immediately. Your exam will be automatically submitted in:
            </p>

            <div className="flex items-center justify-center gap-2 text-xl font-bold text-red-500">
              <Clock className="h-5 w-5" />
              <span>{remainingTime || 0} seconds</span>
            </div>

            <Progress value={progressValue} className="h-2" />

            <p className="font-semibold leading-normal">
              Leaving the exam window multiple times may be flagged as a
              potential integrity violation.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogAction
            onClick={onReturn}
            className="bg-primary hover:bg-primary/90"
          >
            Return to Exam
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
