import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

// Mock data for demonstration - replace with real data from context
const mockActiveExams = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    startDate: new Date(2023, 7, 20),
    duration: 60, // minutes
    status: "active",
  },
  {
    id: 2,
    title: "React Advanced Concepts",
    description: "Deep dive into advanced React patterns",
    startDate: new Date(2023, 7, 25),
    duration: 90, // minutes
    status: "active",
  },
];

const mockCompletedExams = [
  {
    id: 3,
    title: "HTML & CSS Basics",
    description: "Fundamentals of web development",
    completedDate: new Date(2023, 6, 10),
    score: 85,
    status: "completed",
  },
  {
    id: 4,
    title: "Data Structures",
    description: "Understanding common data structures",
    completedDate: new Date(2023, 7, 5),
    score: 92,
    status: "completed",
  },
];

export function ExamSection() {
  const [activeExams, setActiveExams] = useState(mockActiveExams);
  const [completedExams, setCompletedExams] = useState(mockCompletedExams);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Exams</TabsTrigger>
          <TabsTrigger value="completed">Completed Exams</TabsTrigger>
        </TabsList>

        {/* Active Exams Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeExams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeExams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{exam.title}</span>
                      <Badge
                        variant="outline"
                        className="ml-2 bg-blue-50 text-blue-700"
                      >
                        Active
                      </Badge>
                    </CardTitle>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span>
                          {exam.startDate.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
                        <span>{exam.duration} minutes</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/user/exams/${exam.id}/start`}>
                        Start Exam
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <AlertCircleIcon className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No Active Exams</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any active exams at the moment.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/user/exams/available">Browse Available Exams</Link>
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Completed Exams Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedExams.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Exam Results</CardTitle>
                <CardDescription>
                  View your performance on past exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">
                          {exam.title}
                        </TableCell>
                        <TableCell>
                          {exam.completedDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span
                              className={`font-medium ${
                                exam.score >= 70
                                  ? "text-green-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {exam.score}%
                            </span>
                            {exam.score >= 70 && (
                              <CheckCircleIcon className="ml-2 h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/user/exams/${exam.id}/result`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <AlertCircleIcon className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No Completed Exams</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't completed any exams yet.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
