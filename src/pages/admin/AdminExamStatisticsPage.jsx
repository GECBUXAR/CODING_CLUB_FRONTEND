import ExamStatisticsDashboard from "@/components/admin/exam-statistics-dashboard";

const AdminExamStatisticsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Exam Statistics</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and statistics for all exams
        </p>
      </div>

      <ExamStatisticsDashboard />
    </div>
  );
};

export default AdminExamStatisticsPage;
