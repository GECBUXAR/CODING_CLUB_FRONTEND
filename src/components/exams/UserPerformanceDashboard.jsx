import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { examService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
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
  LineChart,
  Line,
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
} from "recharts";
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  PieChart as PieChartIcon,
  Calendar 
} from "lucide-react";

const UserPerformanceDashboard = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const GRADE_COLORS = {
    "A+": "#22c55e",
    "A": "#4ade80",
    "B+": "#a3e635",
    "B": "#facc15",
    "C+": "#fb923c",
    "C": "#f87171",
    "D": "#ef4444",
    "F": "#b91c1c",
  };

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        setError(null);

        // If no userId is provided, use the current user's ID
        const targetUserId = userId || user?.id;
        
        if (!targetUserId) {
          setError("User ID is required");
          return;
        }

        const response = await examService.getUserPerformance(targetUserId);

        if (response.success) {
          setPerformance(response.data);
        } else {
          setError(response.error || "Failed to fetch performance data");
        }
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError("An error occurred while fetching performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [userId, user?.id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format month for trend chart
  const formatMonth = (monthYear) => {
    const [year, month] = monthYear.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  };

  // Prepare data for grade distribution chart
  const prepareGradeData = (results) => {
    if (!results || !results.length) return [];
    
    const gradeCounts = {};
    
    results.forEach(result => {
      if (!gradeCounts[result.grade]) {
        gradeCounts[result.grade] = 0;
      }
      gradeCounts[result.grade]++;
    });
    
    return Object.keys(gradeCounts).map(grade => ({
      name: grade,
      value: gradeCounts[grade],
      color: GRADE_COLORS[grade] || "#9ca3af"
    }));
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
  if (!performance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Performance Data</CardTitle>
          <CardDescription>
            No exam results found for this user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Take some exams to see your performance analytics!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for trend chart
  const trendData = performance.trend.map(month => ({
    name: formatMonth(month.month),
    score: Math.round(month.averageScore),
    examCount: month.examCount
  }));

  // Prepare data for grade distribution
  const gradeData = prepareGradeData(performance.results);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Performance Overview</CardTitle>
          <CardDescription>
            Your exam performance statistics and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {Math.round(performance.overall.averageScore)}%
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      performance.overall.averageScore >= 70
                        ? "bg-green-50 text-green-700"
                        : performance.overall.averageScore >= 50
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {performance.overall.averageScore >= 70
                      ? "Excellent"
                      : performance.overall.averageScore >= 50
                      ? "Good"
                      : "Needs Improvement"}
                  </Badge>
                </div>
                <Progress
                  value={performance.overall.averageScore}
                  className="mt-2 h-2"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span>Best: {performance.overall.bestScore}%</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    <span>Worst: {performance.overall.worstScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performance.overall.passRate}%
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      performance.overall.passRate >= 80
                        ? "bg-green-50 text-green-700"
                        : performance.overall.passRate >= 60
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {performance.overall.passedExams} / {performance.overall.totalExams}
                  </Badge>
                </div>
                <Progress
                  value={performance.overall.passRate}
                  className="mt-2 h-2"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  You've passed {performance.overall.passedExams} out of{" "}
                  {performance.overall.totalExams} exams
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Exams Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {performance.overall.totalExams}
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Calendar className="mr-1 h-3 w-3" />
                    {performance.results.length > 0
                      ? formatDate(performance.results[0].date)
                      : "N/A"}
                  </Badge>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Last exam taken:{" "}
                  {performance.results.length > 0
                    ? performance.results[0].exam
                    : "None"}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trend">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trend">
            <TrendingUp className="mr-2 h-4 w-4" />
            Performance Trend
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Grade Distribution
          </TabsTrigger>
          <TabsTrigger value="history">
            <BarChart2 className="mr-2 h-4 w-4" />
            Exam History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Your average scores over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" domain={[0, 100]} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 'dataMax + 1']}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="score"
                        name="Average Score (%)"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="examCount"
                        name="Exams Taken"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Not enough data to show performance trend
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>
                Distribution of grades across all exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gradeData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gradeData}
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
                        {gradeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} exam${value !== 1 ? "s" : ""}`,
                          `Grade ${name}`,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Not enough data to show grade distribution
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam History</CardTitle>
              <CardDescription>
                Your performance in individual exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performance.results.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performance.results.slice(0, 10)} // Show last 10 exams
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="exam"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          value.length > 15
                            ? `${value.substring(0, 15)}...`
                            : value
                        }
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="score"
                        name="Score (%)"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No exam history available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
          <CardDescription>
            Your most recent exam results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performance.results.slice(0, 5).map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <div
                  className={`h-1 w-full ${
                    result.passed
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{result.exam}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(result.date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-sm font-medium">Score</span>
                        <p className="text-lg font-bold">{result.score}%</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Badge
                          className={
                            result.passed
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {result.grade}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {performance.results.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No recent exams found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPerformanceDashboard;
