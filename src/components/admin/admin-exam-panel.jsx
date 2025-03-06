"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash,
  FileText,
  Check,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { ExamFormModal } from "@/components/admin/exam-form-modal";
import { QuestionFormModal } from "@/components/admin/question-form-modal";
import { ExamSettingsModal } from "@/components/admin/exam-settings-modal";

export function AdminExamPanel() {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      timeLimit: 60, // in minutes
      questionCount: 15,
      status: "draft",
      createdAt: "2025-02-10",
      settings: {
        randomizeQuestions: false,
        showResultsImmediately: true,
        passingScore: 70,
        allowRetakes: false,
      },
    },
    {
      id: 2,
      title: "React Components",
      description: "Assessment on React component patterns and lifecycle",
      timeLimit: 45,
      questionCount: 10,
      status: "published",
      createdAt: "2025-02-15",
      settings: {
        randomizeQuestions: true,
        showResultsImmediately: false,
        passingScore: 75,
        allowRetakes: false,
      },
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox",
      description: "Test your layout skills with CSS Grid and Flexbox",
      timeLimit: 30,
      questionCount: 8,
      status: "published",
      createdAt: "2025-02-20",
      settings: {
        randomizeQuestions: true,
        showResultsImmediately: true,
        passingScore: 60,
        allowRetakes: true,
      },
    },
    {
      id: 4,
      title: "Python Basics",
      description: "Introduction to Python programming language",
      timeLimit: 60,
      questionCount: 20,
      status: "completed",
      createdAt: "2025-01-15",
      settings: {
        randomizeQuestions: false,
        showResultsImmediately: false,
        passingScore: 65,
        allowRetakes: false,
      },
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);

  // All handler functions remain the same without type annotations
  const handleAddExam = () => {
    setCurrentExam(null);
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setCurrentExam(exam);
    setIsExamModalOpen(true);
  };

  const handleDeleteExam = (exam) => {
    setCurrentExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleAddQuestions = (exam) => {
    setCurrentExam(exam);
    setIsQuestionModalOpen(true);
  };

  const handleEditSettings = (exam) => {
    setCurrentExam(exam);
    setIsSettingsModalOpen(true);
  };

  const handlePublishExam = (exam) => {
    setExams(
      exams.map((e) =>
        e.id === exam.id
          ? { ...e, status: e.status === "draft" ? "published" : "draft" }
          : e
      )
    );
  };

  const handlePublishResults = (exam) => {
    console.log(`Publishing results for ${exam.title}`);
    alert(`Results for "${exam.title}" have been published to users.`);
  };

  const confirmDeleteExam = () => {
    if (currentExam) {
      setExams(exams.filter((exam) => exam.id !== currentExam.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveExam = (examData) => {
    if (currentExam) {
      setExams(
        exams.map((exam) =>
          exam.id === currentExam.id ? { ...exam, ...examData } : exam
        )
      );
    } else {
      const newExam = {
        id: exams.length + 1,
        ...examData,
        questionCount: 0,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
        settings: {
          randomizeQuestions: false,
          showResultsImmediately: true,
          passingScore: 70,
          allowRetakes: false,
        },
      };
      setExams([...exams, newExam]);
    }
    setIsExamModalOpen(false);
  };

  const handleSaveQuestions = (questions) => {
    if (currentExam) {
      setExams(
        exams.map((exam) =>
          exam.id === currentExam.id
            ? { ...exam, questionCount: questions.length }
            : exam
        )
      );
    }
    setIsQuestionModalOpen(false);
  };

  const handleSaveSettings = (settings) => {
    if (currentExam) {
      setExams(
        exams.map((exam) =>
          exam.id === currentExam.id ? { ...exam, settings } : exam
        )
      );
    }
    setIsSettingsModalOpen(false);
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Draft
          </Badge>
        );
      case "published":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Published
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Exams</h2>
        <Button onClick={handleAddExam}>
          <Plus className="mr-2 h-4 w-4" /> Create Exam
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
          <CardDescription>
            Manage coding club exams and assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Title</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Time Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{exam.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {exam.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{exam.questionCount}</TableCell>
                  <TableCell>{exam.timeLimit} min</TableCell>
                  <TableCell>{getStatusBadge(exam.status)}</TableCell>
                  <TableCell>{exam.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditExam(exam)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Exam
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAddQuestions(exam)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Manage Questions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditSettings(exam)}
                        >
                          <Settings className="mr-2 h-4 w-4" /> Exam Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePublishExam(exam)}
                        >
                          {exam.status === "draft" ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> Publish Exam
                            </>
                          ) : exam.status === "published" ? (
                            <>
                              <X className="mr-2 h-4 w-4" /> Unpublish Exam
                            </>
                          ) : null}
                        </DropdownMenuItem>
                        {exam.status === "completed" && (
                          <DropdownMenuItem
                            onClick={() => handlePublishResults(exam)}
                          >
                            <Check className="mr-2 h-4 w-4" /> Publish Results
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteExam(exam)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete Exam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExamFormModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSave={handleSaveExam}
        exam={currentExam}
      />

      <QuestionFormModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestions}
        exam={currentExam}
      />

      <ExamSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        settings={currentExam?.settings}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteExam}
        title="Delete Exam"
        description={`Are you sure you want to delete "${currentExam?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
