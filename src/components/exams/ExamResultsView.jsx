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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";

const ExamResultsView = () => {
  const { examId, resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificateLoading, setCertificateLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the enhanced exam API
        const response = await examService.getExamResult(examId, resultId);

        if (response.success) {
          setResult(response.data);
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

  const handleGenerateCertificate = async () => {
    try {
      setCertificateLoading(true);
      const response = await examService.generateCertificate(examId, resultId);

      if (response.success) {
        // Update the result with certificate data
        setResult((prev) => ({
          ...prev,
          certificate: response.data,
        }));
      } else {
        setError(response.error || "Failed to generate certificate");
      }
    } catch (err) {
      console.error("Error generating certificate:", err);
      setError("An error occurred while generating the certificate");
    } finally {
      setCertificateLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (result?.certificate?.certificateUrl) {
      window.open(result.certificate.certificateUrl, "_blank");
    }
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (passed) => {
    if (passed) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Passed
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Failed
        </Badge>
      );
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Exam Result</CardTitle>
              <CardDescription>
                {result.event?.title || "Exam"} - Attempt {result.attemptNumber}
              </CardDescription>
            </div>
            <div>{getStatusBadge(result.passed)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium">Score</h3>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {Math.round(result.percentageScore)}%
                </span>
                <Progress
                  value={result.percentageScore}
                  className="h-2 w-32"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.score} out of {result.totalScore} points
              </p>
            </div>
            <div>
              <h3 className="font-medium">Details</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Grade:</span> {result.grade}
                </p>
                <p>
                  <span className="font-medium">Submitted:</span>{" "}
                  {formatDate(result.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {result.duration
                    ? `${Math.floor(result.duration / 60)}m ${
                        result.duration % 60
                      }s`
                    : "Not recorded"}
                </p>
              </div>
            </div>
          </div>

          {result.feedback && (
            <div className="mt-4 rounded-md bg-blue-50 p-3 text-blue-800">
              <h3 className="font-medium">Feedback</h3>
              <p className="mt-1">{result.feedback}</p>
            </div>
          )}

          {/* Certificate section */}
          {result.passed && (
            <div className="mt-6 rounded-md border p-4">
              <h3 className="font-medium">Certificate</h3>
              {result.certificate?.issued ? (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Certificate issued on{" "}
                    {formatDate(result.certificate.issuedAt)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Certificate ID: {result.certificate.certificateId}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    You are eligible for a certificate. Generate it now!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleGenerateCertificate}
                    disabled={certificateLoading}
                  >
                    {certificateLoading ? "Generating..." : "Generate Certificate"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answers section */}
      <Card>
        <CardHeader>
          <CardTitle>Answers</CardTitle>
          <CardDescription>
            Review your answers and see the correct solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Total: {result.answers?.length || 0} questions
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Your Answer</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-24 text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.answers?.map((answer, index) => (
                <TableRow key={answer._id || index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {answer.question?.questionText || "Question not available"}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(answer.answerGiven)
                      ? answer.answerGiven.join(", ")
                      : answer.answerGiven || "No answer provided"}
                  </TableCell>
                  <TableCell className="text-center">
                    {getAnswerStatusIcon(answer.isCorrect)}
                  </TableCell>
                  <TableCell className="text-right">
                    {answer.pointsAwarded !== null
                      ? answer.pointsAwarded
                      : "Pending"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/exams/${examId}`)}
          >
            View Exam Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExamResultsView;
