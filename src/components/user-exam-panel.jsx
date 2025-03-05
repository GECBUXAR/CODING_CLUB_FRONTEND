"use client";

import { useState } from "react";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamTakingModal } from "@/components/exam-taking-modal";
import { ExamResultsModal } from "@/components/exam-results-modal";

export function UserExamPanel() {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      timeLimit: 60,
      questionCount: 15,
      status: "available",
      dueDate: "2025-03-25",
    },
    {
      id: 2,
      title: "React Components",
      description: "Assessment on React component patterns and lifecycle",
      timeLimit: 45,
      questionCount: 10,
      status: "available",
      dueDate: "2025-03-20",
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox",
      description: "Test your layout skills with CSS Grid and Flexbox",
      timeLimit: 30,
      questionCount: 8,
      status: "completed",
      dueDate: "2025-02-28",
      score: 85,
      passingScore: 60,
      passed: true,
    },
    {
      id: 4,
      title: "Python Basics",
      description: "Introduction to Python programming language",
      timeLimit: 60,
      questionCount: 20,
      status: "completed",
      dueDate: "2025-02-15",
      score: 65,
      passingScore: 70,
      passed: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [isExamTakingModalOpen, setIsExamTakingModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  const handleStartExam = (exam) => {
    setCurrentExam(exam);
    setIsExamTakingModalOpen(true);
  };

  const handleViewResults = (exam) => {
    setCurrentExam(exam);
    setIsResultsModalOpen(true);
  };

  const handleExamSubmit = (examId, answers) => {
    const score = Math.floor(Math.random() * 41) + 60;
    const exam = exams.find((e) => e.id === examId);

    if (exam) {
      const passingScore = 70;
      const updatedExam = {
        ...exam,
        status: "completed",
        score,
        passingScore,
        passed: score >= passingScore,
      };

      setExams(exams.map((e) => (e.id === examId ? updatedExam : e)));
      setCurrentExam(updatedExam);
      setIsExamTakingModalOpen(false);
      setIsResultsModalOpen(true);
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      (activeTab === "available"
        ? exam.status === "available"
        : exam.status === "completed") &&
      (exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Exams</h2>
          <p className="text-muted-foreground">
            View and take your coding club exams
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="available">Available Exams</TabsTrigger>
              <TabsTrigger value="completed">Completed Exams</TabsTrigger>
            </TabsList>
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exams..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="available" className="mt-6">
            {filteredExams.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">
                  No available exams found.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExams.map((exam) => (
                  <Card key={exam.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                      <CardDescription>{exam.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Time Limit: {exam.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Due Date: {exam.dueDate}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-2">
                            Questions: {exam.questionCount}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleStartExam(exam)}
                      >
                        Start Exam <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {filteredExams.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">
                  No completed exams found.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExams.map((exam) => (
                  <Card key={exam.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{exam.title}</CardTitle>
                        {exam.passed ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Passed
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            Failed
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{exam.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              Score: {exam.score}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Passing: {exam.passingScore}%
                            </span>
                          </div>
                          <Progress value={exam.score} className="h-2" />
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Completed: {exam.dueDate}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewResults(exam)}
                      >
                        View Results
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ExamTakingModal
          isOpen={isExamTakingModalOpen}
          onClose={() => setIsExamTakingModalOpen(false)}
          onSubmit={handleExamSubmit}
          exam={currentExam}
        />

        <ExamResultsModal
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          exam={currentExam}
        />
      </div>
    </main>
  );
}
