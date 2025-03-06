"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash, Edit } from "lucide-react";

const questionFormSchema = z.object({
  questionText: z
    .string()
    .min(5, "Question text must be at least 5 characters"),
  questionType: z.enum([
    "multiple-choice",
    "true-false",
    "short-answer",
    "code",
  ]),
  points: z.coerce
    .number()
    .min(1, "Points must be at least 1")
    .max(100, "Points cannot exceed 100"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().or(z.array(z.string())),
});

export function QuestionFormModal({ isOpen, onClose, onSave, exam }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: "What is JavaScript?",
      questionType: "multiple-choice",
      points: 5,
      options: [
        "A programming language",
        "A markup language",
        "A database system",
        "An operating system",
      ],
      correctAnswer: "A programming language",
    },
    {
      id: 2,
      questionText: "JavaScript is a statically typed language.",
      questionType: "true-false",
      points: 3,
      options: ["True", "False"],
      correctAnswer: "False",
    },
    {
      id: 3,
      questionText: "What does DOM stand for?",
      questionType: "short-answer",
      points: 5,
      correctAnswer: "Document Object Model",
    },
    {
      id: 4,
      questionText: "Write a function that returns the sum of two numbers.",
      questionType: "code",
      points: 10,
      correctAnswer: "function sum(a, b) {\n  return a + b;\n}",
    },
  ]);

  const [activeTab, setActiveTab] = useState("question-list");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const form = useForm({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionText: "",
      questionType: "multiple-choice",
      points: 5,
      options: [],
      correctAnswer: "",
    },
  });

  const questionType = form.watch("questionType");

  useEffect(() => {
    if (editingQuestion) {
      form.reset({
        questionText: editingQuestion.questionText,
        questionType: editingQuestion.questionType,
        points: editingQuestion.points,
        options: editingQuestion.options || [],
        correctAnswer: editingQuestion.correctAnswer,
      });
      setOptions(editingQuestion.options || []);
    } else {
      form.reset({
        questionText: "",
        questionType: "multiple-choice",
        points: 5,
        options: [],
        correctAnswer: "",
      });
      setOptions([]);
    }
  }, [editingQuestion, form]);

  useEffect(() => {
    if (questionType === "multiple-choice") {
      if (options.length === 0) {
        setOptions(["", "", "", ""]);
      }
    } else if (questionType === "true-false") {
      setOptions(["True", "False"]);
    } else {
      setOptions([]);
    }
  }, [questionType, options.length]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setActiveTab("add-question");
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  function onSubmit(data) {
    const formattedData = {
      ...data,
      options: options.length > 0 ? options : undefined,
    };

    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? { ...q, ...formattedData } : q
        )
      );
    } else {
      const newQuestion = {
        id:
          questions.length > 0
            ? Math.max(...questions.map((q) => q.id)) + 1
            : 1,
        ...formattedData,
      };
      setQuestions([...questions, newQuestion]);
    }

    setEditingQuestion(null);
    form.reset();
    setActiveTab("question-list");
  }

  const handleSaveQuestions = () => {
    onSave(questions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Questions for {exam?.title}</DialogTitle>
          <DialogDescription>
            Add, edit, or remove questions for this exam.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="question-list">Question List</TabsTrigger>
            <TabsTrigger value="add-question">
              {editingQuestion ? "Edit Question" : "Add Question"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question-list">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Questions ({questions.length})
                </h3>
                <Button
                  onClick={() => {
                    setEditingQuestion(null);
                    setActiveTab("add-question");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">
                    No questions added yet. Click "Add Question" to create your
                    first question.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">
                          {question.questionText.length > 50
                            ? `${question.questionText.substring(0, 50)}...`
                            : question.questionText}
                        </TableCell>
                        <TableCell className="capitalize">
                          {question.questionType.replace("-", " ")}
                        </TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="add-question">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your question here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true-false">
                              True/False
                            </SelectItem>
                            <SelectItem value="short-answer">
                              Short Answer
                            </SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={100} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {(questionType === "multiple-choice" ||
                  questionType === "true-false") && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...options];
                              newOptions[index] = e.target.value;
                              setOptions(newOptions);
                            }}
                            placeholder={`Option ${index + 1}`}
                            disabled={questionType === "true-false"}
                          />
                          {questionType !== "true-false" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove option</span>
                            </Button>
                          )}
                        </div>
                      ))}

                      {questionType === "multiple-choice" && (
                        <div className="flex gap-2">
                          <Input
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            placeholder="New option"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddOption}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="correctAnswer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correct Answer</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                {options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={option}
                                      id={`option-${index}`}
                                    />
                                    <label
                                      htmlFor={`option-${index}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {questionType === "short-answer" && (
                  <FormField
                    control={form.control}
                    name="correctAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter the correct answer"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the expected answer. Multiple variations can be
                          separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {questionType === "code" && (
                  <FormField
                    control={form.control}
                    name="correctAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer (Code)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="function example() {\n  // Your code here\n}"
                            className="font-mono h-32"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the expected code solution. This will be used to
                          evaluate student answers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingQuestion(null);
                      setActiveTab("question-list");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingQuestion ? "Update Question" : "Add Question"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuestions}>Save All Questions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
