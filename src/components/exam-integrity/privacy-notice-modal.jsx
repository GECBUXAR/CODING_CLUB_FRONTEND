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
import { AlertCircle, Shield, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function PrivacyNoticeModal({
  isOpen,
  onAccept,
  onDecline,
  accessibilityEnabled = false,
}) {
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <AlertDialogTitle className="text-lg">
              Exam Integrity Notice
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Please review this important information about exam integrity
            monitoring.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 my-4 text-sm">
          <div className="rounded-md border p-4 bg-muted/30">
            <h3 className="font-medium flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-primary" />
              What will be monitored during this exam
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-medium">Fullscreen status:</span> You must
                keep the exam in fullscreen mode at all times.
              </li>
              <li>
                <span className="font-medium">Window focus:</span> Switching to
                other applications or browser tabs is not permitted.
              </li>
              <li>
                <span className="font-medium">Browser activity:</span> Use of
                browser developer tools is not allowed.
              </li>
              <li>
                <span className="font-medium">System information:</span> Basic
                information about your browser and system will be collected.
              </li>
              <li>
                <span className="font-medium">Screen sharing detection:</span>{" "}
                The system may detect if screen sharing is active.
              </li>
              <li>
                <span className="font-medium">Connection status:</span> Your
                internet connection will be monitored.
              </li>
            </ul>
          </div>

          <div className="rounded-md border p-4 bg-amber-50 border-amber-200">
            <h3 className="font-medium flex items-center mb-2 text-amber-800">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
              Important information
            </h3>
            <p className="text-amber-700 mb-2">
              If you exit fullscreen mode, switch applications, or disconnect
              from the internet, the system will record these actions. Multiple
              violations may result in your exam being automatically submitted.
            </p>
            <p className="text-amber-700">
              The collected data will only be used for the purpose of ensuring
              exam integrity and will be handled in accordance with our privacy
              policy.
            </p>
          </div>

          {accessibilityEnabled && (
            <div className="rounded-md border p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium flex items-center mb-2 text-blue-800">
                <Info className="h-4 w-4 mr-2 text-blue-600" />
                Accessibility accommodations
              </h3>
              <p className="text-blue-700 mb-2">
                If you require accessibility accommodations, you can enable
                Accessibility Mode after accepting this notice. This will relax
                certain monitoring restrictions.
              </p>
              <p className="text-blue-700">
                Please note that your use of accommodations will be recorded
                with your exam submission.
              </p>
            </div>
          )}

          <div className="flex items-start pt-2">
            <Checkbox
              id="terms"
              checked={confirmationChecked}
              onCheckedChange={(checked) => setConfirmationChecked(!!checked)}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that my exam activity will be monitored for academic
              integrity purposes, and I consent to this monitoring.
            </label>
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onDecline}>
            Decline & Exit
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAccept}
            disabled={!confirmationChecked}
            className="bg-primary hover:bg-primary/90"
          >
            Accept & Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
