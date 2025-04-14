import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import examService from "@/services/examService";

export function UploadExamScoresModal({ isOpen, onClose, examId, onSuccess }) {
  const [jsonData, setJsonData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const handleSubmit = async () => {
    if (!jsonData.trim()) {
      setError("Please enter JSON data");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setProcessedData(null);

    try {
      const result = await examService.uploadTemporaryExamScores(examId, jsonData);
      
      if (result.success) {
        setSuccess(result.message);
        setProcessedData(result.data);
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.error || "Failed to process exam scores");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Error uploading scores:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadToServer = async () => {
    if (!processedData) {
      setError("No processed data to upload");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await examService.uploadPreviousExamScores(examId, processedData);
      
      if (result.success) {
        setSuccess(result.message || "Successfully uploaded scores to server");
        if (onSuccess) {
          onSuccess(result.data, true);
        }
        // Close the modal after successful upload
        setTimeout(() => onClose(), 2000);
      } else {
        setError(result.error || "Failed to upload exam scores to server");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Error uploading scores to server:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setJsonData("");
    setError(null);
    setSuccess(null);
    setProcessedData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Previous Exam Scores</DialogTitle>
          <DialogDescription>
            Paste the JSON array containing student scores. Each entry should have name, roll_no, and marks fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="json-data">JSON Data</Label>
            <Textarea
              id="json-data"
              placeholder='[{"name": "Student Name", "roll_no": "24CS01", "marks": 85}]'
              rows={10}
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              disabled={isSubmitting}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste the JSON array containing student scores. Make sure it's properly formatted.
            </p>
          </div>

          {processedData && (
            <div className="space-y-2">
              <Label>Processed Data Summary</Label>
              <div className="bg-slate-50 p-3 rounded-md border text-sm">
                <p>Successfully processed {processedData.length} student records.</p>
                <p>Highest score: {Math.max(...processedData.map(s => s.score))}</p>
                <p>Lowest score: {Math.min(...processedData.map(s => s.score))}</p>
                <p>Average score: {(processedData.reduce((sum, s) => sum + s.score, 0) / processedData.length).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          
          <Button onClick={handleSubmit} disabled={isSubmitting || !jsonData.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Process JSON</>
            )}
          </Button>
          
          {processedData && (
            <Button 
              onClick={handleUploadToServer} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Server
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
