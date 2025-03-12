import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNotification } from "@/contexts/notification-context";
import { createExam, updateExam } from "../../lib/api";

export function ExamForm({ isOpen, onClose, exam, refreshExams }) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalTime: 60,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || "",
        description: exam.description || "",
        totalTime: exam.totalTime || 60,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        totalTime: 60,
      });
    }
  }, [exam, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalTime" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (exam) {
        await updateExam(exam.id, formData);
        showNotification("Exam updated successfully", "success");
      } else {
        await createExam(formData);
        showNotification("Exam created successfully", "success");
      }
      refreshExams();
      onClose();
    } catch (error) {
      console.error("Error submitting exam:", error);
      showNotification(
        `Error ${exam ? "updating" : "creating"} exam: ${error.message}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            {exam ? "Edit Exam" : "Add New Exam"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter exam title"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter exam description"
              className="w-full"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalTime" className="text-sm font-medium">
              Total Time (minutes)
            </Label>
            <Input
              id="totalTime"
              name="totalTime"
              type="number"
              value={formData.totalTime}
              onChange={handleChange}
              min={1}
              className="w-full"
              required
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-24"
              size="default"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-24"
              size="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : exam ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
