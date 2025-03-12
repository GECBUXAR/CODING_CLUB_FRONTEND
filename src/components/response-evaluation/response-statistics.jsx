import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  BarChart,
  Users,
  Award,
  Percent,
  Book,
  TrendingUp,
  BarChart2,
  Clock4,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ResponseStatistics = ({ examStats, questionStats }) => {
  if (!examStats) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-800">
          No statistics available
        </p>
        <p className="text-slate-500 mt-1">
          There are no responses to generate statistics yet.
        </p>
      </div>
    );
  }

  const {
    totalSubmissions,
    averageScore,
    passRate,
    averageTimeSpent,
    questionStatistics = [],
  } = examStats;

  // Format time from seconds to minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Responses"
          value={totalSubmissions}
          icon={<Users className="h-5 w-5 text-indigo-500" />}
          description="Total submitted responses"
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
        />

        <StatCard
          title="Average Score"
          value={`${Math.round(averageScore)}%`}
          icon={<Award className="h-5 w-5 text-emerald-500" />}
          description="Average student score"
          bgColor="bg-emerald-50"
          textColor="text-emerald-700"
        />

        <StatCard
          title="Pass Rate"
          value={`${Math.round(passRate)}%`}
          icon={<Percent className="h-5 w-5 text-blue-500" />}
          description="Students who passed"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />

        <StatCard
          title="Avg. Time Spent"
          value={formatTime(averageTimeSpent)}
          icon={<Clock4 className="h-5 w-5 text-amber-500" />}
          description="Average completion time"
          bgColor="bg-amber-50"
          textColor="text-amber-700"
        />
      </div>

      {/* Question Performance */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Question Performance
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Performance breakdown by question
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-normal">
              {questionStatistics.length} Questions
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px]">
            <div className="p-4 space-y-4">
              {questionStatistics && questionStatistics.length > 0 ? (
                questionStatistics.map((question, index) => (
                  <QuestionPerformanceCard
                    key={index}
                    questionNum={index + 1}
                    stats={question}
                  />
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-slate-500">
                    No question statistics available
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="bg-slate-50 rounded-b-lg p-4 text-xs text-slate-500">
          Statistics are updated in real-time as evaluations are completed
        </CardFooter>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, description, bgColor, textColor }) => {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className={`p-1 ${bgColor}`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${bgColor} mt-1`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuestionPerformanceCard = ({ questionNum, stats }) => {
  const {
    questionId,
    totalResponses,
    correctResponses,
    incorrectResponses,
    averageScore,
    averageTimeSpent,
    difficultyRating,
  } = stats;

  // Calculate percentage of correct responses
  const correctPercentage = totalResponses
    ? Math.round((correctResponses / totalResponses) * 100)
    : 0;

  // Determine difficulty color
  const getDifficultyColor = (rating) => {
    if (rating < 3) return "text-green-500";
    if (rating < 4) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <div className="bg-slate-100 rounded-full h-8 w-8 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-slate-700">
              {questionNum}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-slate-800">
              Question {questionNum}
            </h3>
            <p className="text-xs text-slate-500">ID: {questionId}</p>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Badge
                  variant={
                    correctPercentage >= 70
                      ? "success"
                      : correctPercentage >= 40
                      ? "warning"
                      : "destructive"
                  }
                  className="text-xs font-normal"
                >
                  {correctPercentage}% Correct
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {correctResponses} correct out of {totalResponses} responses
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      <div className="p-4 bg-slate-50">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-500">Score Distribution</span>
            <span className="text-xs font-medium text-slate-700">
              {Math.round(averageScore)}% avg
            </span>
          </div>
          <div className="flex h-2 overflow-hidden bg-slate-200 rounded">
            <div
              className="bg-green-500"
              style={{ width: `${correctPercentage}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${100 - correctPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
              <span>Correct</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-1" />
              <span>Incorrect</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Avg. Time</span>
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-slate-400 mr-1" />
              <span className="text-sm font-medium text-slate-700">
                {formatTime(averageTimeSpent)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-1">Difficulty</span>
            <div className="flex items-center">
              <BarChart2
                className={`h-3 w-3 mr-1 ${getDifficultyColor(
                  difficultyRating
                )}`}
              />
              <span
                className={`text-sm font-medium ${getDifficultyColor(
                  difficultyRating
                )}`}
              >
                {difficultyRating < 3
                  ? "Easy"
                  : difficultyRating < 4
                  ? "Medium"
                  : "Hard"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseStatistics;
