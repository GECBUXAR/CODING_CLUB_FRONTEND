import { useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const examFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  timeLimit: z.coerce
    .number()
    .min(5, "Time limit must be at least 5 minutes")
    .max(180, "Time limit cannot exceed 180 minutes"),
  status: z.enum(["draft", "published", "closed"]),
  passingScore: z.coerce
    .number()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100")
    .default(60),
  randomizeQuestions: z.boolean().default(false),
  showResultsImmediately: z.boolean().default(true),
  allowedAttempts: z.coerce
    .number()
    .min(1, "Allowed attempts must be at least 1")
    .max(10, "Allowed attempts cannot exceed 10")
    .default(1),
  examType: z
    .enum(["quiz", "coding", "practical", "theoretical", "mixed"])
    .default("quiz"),
  instructions: z.string().optional(),
});

export function ExamFormModal({ isOpen, onClose, onSave, exam }) {
  const form = useForm({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      timeLimit: 60,
      status: "draft",
      passingScore: 60,
      randomizeQuestions: false,
      showResultsImmediately: true,
      allowedAttempts: 1,
      examType: "quiz",
      instructions: "",
    },
  });

  useEffect(() => {
    if (exam) {
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = exam.date
        ? new Date(exam.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      // Get exam details or default values
      const examDetails = exam.examDetails || {};

      form.reset({
        title: exam.title || "",
        description: exam.description || "",
        date: formattedDate,
        timeLimit: exam.timeLimit || 60,
        status: exam.status || "draft",
        passingScore: examDetails.passingScore || 60,
        randomizeQuestions: examDetails.randomizeQuestions || false,
        showResultsImmediately: examDetails.showResultsImmediately || true,
        allowedAttempts: examDetails.allowedAttempts || 1,
        examType: examDetails.examType || "quiz",
        instructions: examDetails.instructions || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        timeLimit: 60,
        status: "draft",
        passingScore: 60,
        randomizeQuestions: false,
        showResultsImmediately: true,
        allowedAttempts: 1,
        examType: "quiz",
        instructions: "",
      });
    }
  }, [exam, form]);

  function onSubmit(data) {
    onSave(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{exam ? "Edit Exam" : "Create New Exam"}</DialogTitle>
          <DialogDescription>
            {exam
              ? "Update the details of this exam."
              : "Fill in the details to create a new exam."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Title</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Test your knowledge of JavaScript basics"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min={5} max={180} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passingScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passing Score (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowedAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Attempts</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                      <SelectItem value="theoretical">Theoretical</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Instructions for exam takers"
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
                name="randomizeQuestions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Randomize Questions</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showResultsImmediately"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Show Results Immediately</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
