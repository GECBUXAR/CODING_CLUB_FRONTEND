import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { examService } from "@/services";
import CertificateTemplate from "@/components/exams/CertificateTemplate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Award } from "lucide-react";

const CertificatePage = () => {
  const { examId, resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await examService.getExamResult(examId, resultId);

        if (response.success) {
          setResult(response.data);
          
          // If certificate doesn't exist, generate one
          if (response.data.passed && !response.data.certificate?.issued) {
            await generateCertificate();
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

    fetchResult();
  }, [examId, resultId]);

  const generateCertificate = async () => {
    try {
      const response = await examService.generateCertificate(examId, resultId);

      if (response.success) {
        // Update the result with certificate data
        setResult((prev) => ({
          ...prev,
          certificate: response.data,
        }));
      } else {
        console.error("Failed to generate certificate:", response.error);
      }
    } catch (err) {
      console.error("Error generating certificate:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[800px]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
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
      </div>
    );
  }

  // No result found
  if (!result) {
    return (
      <div className="container mx-auto py-6">
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
      </div>
    );
  }

  // Not passed
  if (!result.passed) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Not Available</CardTitle>
            <CardDescription>
              You need to pass the exam to receive a certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Your score: {Math.round(result.percentageScore)}% (Passing score: 40%)
            </p>
            <div className="mt-4 flex space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button onClick={() => navigate(`/exams/${examId}`)}>
                <Award className="mr-2 h-4 w-4" />
                View Exam Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Certificate data
  const certificateData = {
    studentName: result.user?.name || "Student",
    examTitle: result.event?.title || "Exam",
    score: Math.round(result.percentageScore),
    grade: result.grade,
    date: result.certificate?.issuedAt || result.createdAt,
    certificateId: result.certificate?.certificateId || "CERT-000000",
    issuerName: "Coding Club",
    issuerTitle: "Administrator"
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificate of Achievement</h1>
          <p className="text-muted-foreground">
            For successfully completing {result.event?.title}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>
      </div>

      <CertificateTemplate certificateData={certificateData} />
    </div>
  );
};

export default CertificatePage;
