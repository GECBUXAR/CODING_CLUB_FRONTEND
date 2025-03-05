"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUp, AlertCircle, Check } from "lucide-react";

const uploadFormSchema = z.object({
  file: z.any().refine((file) => file?.length === 1, "Please select a file"),
});

export function UploadResultsModal({ isOpen, onClose, event }) {
  const [activeTab, setActiveTab] = useState("upload");
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockData = [
        { rank: 1, name: "John Doe", score: 95, time: "00:45:30" },
        { rank: 2, name: "Jane Smith", score: 92, time: "00:48:15" },
        { rank: 3, name: "Alex Johnson", score: 88, time: "00:50:22" },
        { rank: 4, name: "Sam Wilson", score: 85, time: "00:52:10" },
        { rank: 5, name: "Taylor Brown", score: 82, time: "00:55:45" },
      ];
      setPreviewData(mockData);
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setActiveTab("preview");
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setActiveTab("upload");
        setPreviewData([]);
        form.reset();
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Results for {event?.title}</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing participant results.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Results have been published successfully.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="preview" disabled={previewData.length === 0}>
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Results File (CSV or Excel)</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
                            <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">
                              Drag and drop your file here, or click to browse
                            </p>
                            <Input
                              {...fieldProps}
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              onChange={(e) => {
                                onChange(e.target.files);
                                handleFileChange(e);
                              }}
                              className="hidden"
                              id="file-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("file-upload")?.click()
                              }
                            >
                              Select File
                            </Button>
                            {value && value[0] && (
                              <p className="text-sm text-gray-500 mt-2">
                                Selected: {value[0].name}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="preview">
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Preview</AlertTitle>
                  <AlertDescription>
                    Review the results before publishing. Once published,
                    results will be visible to all members.
                  </AlertDescription>
                </Alert>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.rank}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.score}</TableCell>
                          <TableCell>{row.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                  >
                    Back
                  </Button>
                  <Button onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? "Publishing..." : "Publish Results"}
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
