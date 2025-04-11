import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

const CertificateTemplate = ({ 
  certificateData = {
    studentName: "",
    examTitle: "",
    score: 0,
    grade: "",
    date: new Date(),
    certificateId: "",
    issuerName: "Coding Club",
    issuerTitle: "Administrator"
  }
}) => {
  const certificateRef = useRef();

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle print certificate
  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `Certificate-${certificateData.certificateId || ""}`,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Certificate
        </Button>
        <Button onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-4">
        <div
          ref={certificateRef}
          className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-white p-8 shadow-lg"
          style={{
            aspectRatio: "1.414 / 1", // A4 aspect ratio
            backgroundImage: "url('/certificate-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Certificate Border */}
          <div className="absolute inset-4 border-8 border-double border-amber-200 opacity-50"></div>

          {/* Certificate Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-between p-8 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="mb-2 text-4xl font-bold text-amber-800">
                Certificate of Achievement
              </div>
              <div className="text-lg text-gray-600">
                This certifies that
              </div>
            </div>

            {/* Student Name */}
            <div className="mb-6 text-5xl font-bold text-amber-900 font-serif">
              {certificateData.studentName || "Student Name"}
            </div>

            {/* Certificate Text */}
            <div className="mb-6 max-w-2xl text-lg text-gray-700">
              <p>
                has successfully completed the exam
                <span className="block mt-2 text-2xl font-semibold text-amber-800">
                  "{certificateData.examTitle || "Exam Title"}"
                </span>
                with a score of{" "}
                <span className="font-semibold">
                  {certificateData.score || 0}%
                </span>{" "}
                and achieved a grade of{" "}
                <span className="font-semibold">
                  {certificateData.grade || "A"}
                </span>
              </p>
            </div>

            {/* Date and Signature */}
            <div className="mt-auto grid w-full grid-cols-2 gap-8">
              <div className="text-left">
                <div className="mb-8 h-px w-48 bg-gray-300"></div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="text-lg font-medium">
                  {formatDate(certificateData.date)}
                </div>
              </div>

              <div className="text-right">
                <div className="mb-8 ml-auto h-px w-48 bg-gray-300"></div>
                <div className="text-sm text-gray-600">Signature</div>
                <div className="text-lg font-medium">
                  {certificateData.issuerName || "Issuer Name"}
                </div>
                <div className="text-sm text-gray-600">
                  {certificateData.issuerTitle || "Title"}
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-8 text-xs text-gray-500">
              Certificate ID: {certificateData.certificateId || "CERT-000000"}
            </div>
          </div>

          {/* Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
            style={{ transform: "rotate(-30deg)" }}
          >
            <div className="text-9xl font-bold text-gray-800">CERTIFIED</div>
          </div>

          {/* Seal */}
          <div className="absolute bottom-12 right-12 h-24 w-24 rounded-full border-4 border-amber-600 bg-amber-100 opacity-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-amber-800">OFFICIAL</div>
              <div className="text-xs font-bold text-amber-800">SEAL</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          This certificate verifies that the student has successfully completed
          the exam and met all requirements.
        </p>
        <p className="mt-1">
          Certificate ID: {certificateData.certificateId || "CERT-000000"}
        </p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
