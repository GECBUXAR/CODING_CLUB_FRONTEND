import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

export function FullscreenWarningModal({
  isOpen,
  onClose,
  isSupported,
  onRetry,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle className="text-lg">
              Fullscreen Required
            </AlertDialogTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {isSupported ? (
              <span>
                This exam requires fullscreen mode to maintain academic
                integrity. Please allow fullscreen mode to continue with the
                exam.
              </span>
            ) : (
              <span>
                Your browser does not support fullscreen mode, which is required
                for this exam. Please try using a different browser such as
                Chrome, Firefox, or Edge.
              </span>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          {isSupported ? (
            <AlertDialogAction
              onClick={onRetry}
              className="bg-primary hover:bg-primary/90"
            >
              Enable Fullscreen
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={onClose}
              className="bg-primary hover:bg-primary/90"
            >
              Understood
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
