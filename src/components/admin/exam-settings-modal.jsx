"use client";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const settingsFormSchema = z.object({
  randomizeQuestions: z.boolean(),
  showResultsImmediately: z.boolean(),
  passingScore: z.coerce
    .number()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100"),
  allowRetakes: z.boolean(),
});

export function ExamSettingsModal({ isOpen, onClose, onSave, settings }) {
  const form = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      randomizeQuestions: false,
      showResultsImmediately: true,
      passingScore: 70,
      allowRetakes: false,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        randomizeQuestions: settings.randomizeQuestions,
        showResultsImmediately: settings.showResultsImmediately,
        passingScore: settings.passingScore,
        allowRetakes: settings.allowRetakes,
      });
    }
  }, [settings, form]);

  function onSubmit(data) {
    onSave(data);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exam Settings</DialogTitle>
          <DialogDescription>
            Configure the settings for this exam.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="randomizeQuestions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Randomize Questions
                    </FormLabel>
                    <FormDescription>
                      Randomize the order of questions for each student
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showResultsImmediately"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Show Results Immediately
                    </FormLabel>
                    <FormDescription>
                      Show results to students immediately after submission
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                  <FormDescription>
                    Minimum percentage required to pass the exam
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowRetakes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Retakes</FormLabel>
                    <FormDescription>
                      Allow students to retake the exam if they fail
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
