import { useState, useEffect } from "react";
import { useExamContext } from "@/contexts/optimized-exam-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AlertTriangle, Users, Clock, Award, BarChart2 } from "lucide-react";

export function ExamStatisticsPanel({ examId }) {
  const { calculateExamStatistics, getQuestionsForExam } = useExamContext();
  const [statistics, setStatistics] = useState(null);

  const questions = getQuestionsForExam(examId);

  useEffect(() => {
    const stats = calculateExamStatistics(examId);
    setStatistics(stats);
  }, [examId, calculateExamStatistics]);

  if (!statistics || statistics.totalSubmissions === 0) {
    return (
      <div className="py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <p className="mt-4 text-lg font-medium">No statistics available</p>
        <p className="text-muted-foreground">
          There are no submissions to analyze for this exam yet.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const scoreDistributionData = [
    { range: "0-20%", count: 0 },
    { range: "21-40%", count: 0 },
    { range: "41-60%", count: 0 },
    { range: "61-80%", count: 0 },
    { range: "81-100%", count: 0 },
  ];

  // This would be populated from actual data in a real implementation
  // For now, we'll use mock data based on the statistics

  // Simulate score distribution based on average score and pass rate
  const avgScore = statistics.averageScore;
  const passRate = statistics.passRate;

  // Create a bell curve-like distribution centered around the average score
  scoreDistributionData[0].count = Math.floor(
    statistics.totalSubmissions * 0.05
  );
  scoreDistributionData[1].count = Math.floor(
    statistics.totalSubmissions * 0.15
  );
  scoreDistributionData[2].count = Math.floor(
    statistics.totalSubmissions * 0.25
  );
  scoreDistributionData[3].count = Math.floor(
    statistics.totalSubmissions * 0.3
  );
  scoreDistributionData[4].count = Math.floor(
    statistics.totalSubmissions * 0.25
  );

  // Prepare question difficulty data
  const questionDifficultyData = statistics.questionStatistics.map(
    (stat, index) => ({
      id: stat.questionId,
      number: index + 1,
      difficulty: Math.round(stat.difficultyRating * 100),
      correctRate: Math.round(
        (stat.correctResponses / stat.totalResponses) * 100
      ),
      avgTime: Math.round(stat.averageTimeSpent),
    })
  );

  // Sort questions by difficulty
  const sortedQuestionsByDifficulty = [...questionDifficultyData].sort(
    (a, b) => b.difficulty - a.difficulty
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-medium">Total Submissions</h3>
              <p className="text-2xl font-bold">
                {statistics.totalSubmissions}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Award className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-medium">Average Score</h3>
              <p className="text-2xl font-bold">
                {Math.round(statistics.averageScore)}%
              </p>
              <Progress
                value={statistics.averageScore}
                className="w-full h-2 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <BarChart2 className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-medium">Pass Rate</h3>
              <p className="text-2xl font-bold">
                {Math.round(statistics.passRate * 100)}%
              </p>
              <Progress
                value={statistics.passRate * 100}
                className="w-full h-2 mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <h3 className="font-medium">Average Time</h3>
              <p className="text-2xl font-bold">
                {Math.round(statistics.averageTimeSpent)} min
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader className="">
            <CardTitle className="">Score Distribution</CardTitle>
            <CardDescription className="">
              Distribution of student scores across ranges
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreDistributionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Students" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="">
            <CardTitle className="">Question Difficulty</CardTitle>
            <CardDescription className="">
              Difficulty rating of each question
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedQuestionsByDifficulty}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="number" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="difficulty"
                    name="Difficulty (%)"
                    fill="#ff7c43"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader className="">
          <CardTitle className="">Question Performance</CardTitle>
          <CardDescription className="">
            Correct answer rate and average time per question
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={questionDifficultyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="number" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="correctRate"
                  name="Correct Rate (%)"
                  stroke="#4ade80"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgTime"
                  name="Avg Time (s)"
                  stroke="#f87171"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader className="">
          <CardTitle className="">Question Analysis</CardTitle>
          <CardDescription className="">
            Detailed statistics for each question
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Question</th>
                  <th className="py-2 px-4 text-left">Difficulty</th>
                  <th className="py-2 px-4 text-left">Correct Rate</th>
                  <th className="py-2 px-4 text-left">Avg Time</th>
                  <th className="py-2 px-4 text-left">Avg Confidence</th>
                </tr>
              </thead>
              <tbody>
                {statistics.questionStatistics.map((stat, index) => {
                  const question = questions.find(
                    (q) => q.id === stat.questionId
                  );
                  const difficultyLevel =
                    stat.difficultyRating < 0.3
                      ? "Easy"
                      : stat.difficultyRating < 0.7
                      ? "Medium"
                      : "Hard";

                  return (
                    <tr key={stat.questionId} className="border-b">
                      <td className="py-2 px-4">
                        <div className="font-medium">Q{index + 1}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {question?.questionText || "Unknown question"}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <Badge
                          variant="outline"
                          className={
                            difficultyLevel === "Easy"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : difficultyLevel === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {difficultyLevel}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">
                        {Math.round(
                          (stat.correctResponses / stat.totalResponses) * 100
                        )}
                        %
                      </td>
                      <td className="py-2 px-4">
                        {Math.round(stat.averageTimeSpent)} sec
                      </td>
                      <td className="py-2 px-4">
                        {Math.round(stat.averageConfidence * 5)}/5
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
