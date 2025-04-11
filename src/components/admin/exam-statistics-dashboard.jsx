import { useState, useEffect } from "react";
import { examService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { 
  Users, 
  Award, 
  BarChart2, 
  PieChart as PieChartIcon,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const ExamStatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await examService.getExamStatistics();

        if (response.success) {
          setStatistics(response.data);
          // Set the first exam as selected by default
          if (response.data && response.data.length > 0) {
            setSelectedExam(response.data[0]);
          }
        } else {
          setError(response.error || "Failed to fetch exam statistics");
        }
      } catch (err) {
        console.error("Error fetching exam statistics:", err);
        setError("An error occurred while fetching exam statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Prepare data for pass/fail chart
  const preparePassFailData = (exam) => {
    if (!exam) return [];
    
    return [
      {
        name: "Passed",
        value: exam.statistics.passedCount,
        color: "#22c55e"
      },
      {
        name: "Failed",
        value: exam.statistics.totalParticipants - exam.statistics.passedCount,
        color: "#ef4444"
      }
    ];
  };

  // Prepare data for score distribution chart
  const prepareScoreDistributionData = (exams) => {
    if (!exams || exams.length === 0) return [];
    
    return exams.map(exam => ({
      name: exam.exam.title.length > 20 
        ? `${exam.exam.title.substring(0, 20)}...` 
        : exam.exam.title,
      average: exam.statistics.averageScore,
      highest: exam.statistics.highestScore,
      lowest: exam.statistics.lowestScore
    }));
  };

  // Calculate overall statistics
  const calculateOverallStats = (exams) => {
    if (!exams || exams.length === 0) return null;
    
    let totalParticipants = 0;
    let totalPassed = 0;
    let totalExams = exams.length;
    let sumAverageScores = 0;
    let highestScore = 0;
    let lowestScore = 100;
    
    exams.forEach(exam => {
      totalParticipants += exam.statistics.totalParticipants;
      totalPassed += exam.statistics.passedCount;
      sumAverageScores += exam.statistics.averageScore;
      highestScore = Math.max(highestScore, exam.statistics.highestScore);
      lowestScore = Math.min(lowestScore, exam.statistics.lowestScore);
    });
    
    return {
      totalExams,
      totalParticipants,
      totalPassed,
      passRate: totalParticipants > 0 ? Math.round((totalPassed / totalParticipants) * 100) : 0,
      averageScore: totalExams > 0 ? Math.round(sumAverageScores / totalExams) : 0,
      highestScore,
      lowestScore
    };
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
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!statistics || statistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Statistics Available</CardTitle>
          <CardDescription>
            No exam data found to generate statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Create and conduct exams to see statistics here
          </p>
        </CardContent>
      </Card>
    );
  }

  const overallStats = calculateOverallStats(statistics);
  const passFailData = preparePassFailData(selectedExam);
  const scoreDistributionData = prepareScoreDistributionData(statistics);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Exam Statistics Dashboard</CardTitle>
          <CardDescription>
            Comprehensive analytics for all exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalExams}</div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Across all subjects and courses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{overallStats.totalParticipants}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Students who have taken exams
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {overallStats.passRate}%
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      overallStats.passRate >= 80
                        ? "bg-green-50 text-green-700"
                        : overallStats.passRate >= 60
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {overallStats.totalPassed} / {overallStats.totalParticipants}
                  </Badge>
                </div>
                <Progress
                  value={overallStats.passRate}
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {overallStats.averageScore}%
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      overallStats.averageScore >= 70
                        ? "bg-green-50 text-green-700"
                        : overallStats.averageScore >= 50
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {overallStats.averageScore >= 70
                      ? "Good"
                      : overallStats.averageScore >= 50
                      ? "Average"
                      : "Low"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span>Highest: {overallStats.highestScore}%</span>
                  </div>
                  <span>Lowest: {overallStats.lowestScore}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>
              Average, highest, and lowest scores across all exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreDistributionData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="highest"
                    name="Highest Score"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="average"
                    name="Average Score"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lowest"
                    name="Lowest Score"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>
                  Select an exam to view detailed statistics
                </CardDescription>
              </div>
              {selectedExam && (
                <Badge
                  variant="outline"
                  className={
                    selectedExam.exam.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : selectedExam.exam.status === "ongoing"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-50 text-yellow-700"
                  }
                >
                  {selectedExam.exam.status.charAt(0).toUpperCase() +
                    selectedExam.exam.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedExam?.exam.id || ""}
                onChange={(e) => {
                  const selected = statistics.find(
                    (stat) => stat.exam.id === e.target.value
                  );
                  setSelectedExam(selected);
                }}
              >
                {statistics.map((stat) => (
                  <option key={stat.exam.id} value={stat.exam.id}>
                    {stat.exam.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedExam && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedExam.exam.date)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExam.statistics.totalParticipants} students
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pass Rate</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExam.statistics.passRate}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Average Score</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExam.statistics.averageScore}%
                    </p>
                  </div>
                </div>

                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={passFailData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {passFailData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} student${value !== 1 ? "s" : ""}`,
                          name,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
          <CardDescription>
            Summary of all exam statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all exams and their statistics</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Participants</TableHead>
                <TableHead className="text-center">Pass Rate</TableHead>
                <TableHead className="text-center">Avg. Score</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((stat) => (
                <TableRow key={stat.exam.id}>
                  <TableCell className="font-medium">
                    {stat.exam.title}
                  </TableCell>
                  <TableCell>{formatDate(stat.exam.date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        stat.exam.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : stat.exam.status === "ongoing"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-yellow-50 text-yellow-700"
                      }
                    >
                      {stat.exam.status.charAt(0).toUpperCase() +
                        stat.exam.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {stat.statistics.totalParticipants}
                  </TableCell>
                  <TableCell className="text-center">
                    {stat.statistics.passRate}%
                  </TableCell>
                  <TableCell className="text-center">
                    {stat.statistics.averageScore}%
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.statistics.averageScore >= 70 ? (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    ) : stat.statistics.averageScore >= 50 ? (
                      <AlertTriangle className="ml-auto h-5 w-5 text-yellow-500" />
                    ) : (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamStatisticsDashboard;
