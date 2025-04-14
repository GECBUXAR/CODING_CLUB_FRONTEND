import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Trophy, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exam1, exam2 } from "@/components/leaderboard/ExamData";

// Mock data for previous exams
const PREVIOUS_EXAMS = [
  {
    id: "exam1",
    name: "Quiz Quest",
    date: "2025-02-25",
    totalMarks: 50,
    data: exam1,
  },
  {
    id: "exam2",
    name: "Find Output Challeng",
    date: "2025-04-04",
    totalMarks: 50,
    data: exam2,
  },
];

// Mock data for exam results (using the data you provided)
// const EXAM_RESULTS = {
//   exam2: [
//     { name: "Nikil Kumar Sharma", "Reg. no": "24EC19", marks: 26 },
//     { name: "Nidhi Kumari", "Reg. no": "24CS106", marks: 28 },
//     { name: "Subhankar Sidhu", "Reg. no": "24CS65", marks: 26 },
//     { name: "Suman Baitha", "Reg. no": "24CS72", marks: 32 },
//     { name: "Harshvardhan kumar", "Reg. no": "24CS74", marks: 14 },
//     { name: "Juhi pandey", "Reg. no": "24CS32p", marks: 20 },
//     { name: "Pranav Prakash", "Reg. no": "24CS71", marks: 36 },
//     { name: "Kumari Riya", "Reg. no": "24CS100", marks: 16 },
//     { name: "Tamanna", "Reg. no": "24CS96", marks: 20 },
//     { name: "Nisha kumari", "Reg. no": "24CS09", marks: 36 },
//     { name: "Aanya", "Reg. no": "24CS115", marks: 20 },
//     { name: "Arushi Thakur", "Reg. no": "24CS82", marks: 18 },
//     { name: "vandana kumari sharma ", "Reg. no": "24EC29", marks: 18 },
//     { name: "Archana kumari", "Reg. no": "24CS48", marks: 14 },
//     { name: "Aditya Tiwari", "Reg. no": "24CS26", marks: 22 },
//     { name: "Riya kumari", "Reg. no": "24CS63p", marks: 18 },
//     { name: "Afsana Praveen", "Reg. no": "24EC24", marks: 16 },
//     { name: "Aman Raj", "Reg. no": "24EC28", marks: 20 },
//     { name: "VIKASH KUMAR YADAV", "Reg. no": "24CS42", marks: 26 },
//     { name: "Nityanand Tiwari", "Reg. no": "24CS02", marks: 32 },
//     { name: "Usha kumari", "Reg. no": "24CS119", marks: 22 },
//     { name: "Riya Kumari", "Reg. no": "24CS38p", marks: 18 },
//     { name: "Saloni kumari", "Reg. no": "24CS95", marks: 26 },
//     { name: "Priya Kumari", "Reg. no": "24CS75", marks: 16 },
//     { name: "Puneet Kumar", "Reg. no": "24CS36", marks: 26 },
//     { name: "NISHANT KUMAR VERMA", "Reg. no": "24CS28", marks: 18 },
//     { name: "Mamnit kumar", "Reg. no": "76", marks: 12 },
//     { name: "Rimjhim kumari", "Reg. no": "24CS61", marks: 18 },
//     { name: "Amrit Raj", "Reg. no": "24EC25", marks: 24 },
//     { name: "Nikhil kumar", "Reg. no": "24CS44", marks: 32 },
//     { name: "AKHIL TIWARI", "Reg. no": "24CS24", marks: 28 },
//     { name: "Virat Raj", "Reg. no": "24CS107", marks: 40 },
//     { name: "SUMAN KUMAR", "Reg. no": "24CS69", marks: 28 },
//     { name: "GOLU KUMAR", "Reg. no": "24CS06", marks: 18 },
//     { name: "Rashid ahmad", "Reg. no": "24CS12", marks: 24 },
//     { name: "Juhi Kumari", "Reg. no": "24CS62", marks: 26 },
//     { name: "Anushka deep", "Reg. no": "24CS14", marks: 22 },
//     { name: "Ranjeet Kumar", "Reg. no": "24CS11", marks: 22 },
//     { name: "Rahul Kumar", "Reg. no": "24CS51", marks: 20 },
//     { name: "Harshit Kumar Thakur", "Reg. no": "24CS17", marks: 36 },
//     { name: "Ankit Kumar Thakur", "Reg. no": "24CS20", marks: 38 },
//     { name: "Anjali Kumari Shukla", "Reg. no": "24CS92", marks: 14 },
//     { name: "Pushpanjali kumari", "Reg. no": "24CS114", marks: 30 },
//     { name: "SIBU PATHAK", "Reg. no": "24CS55", marks: 34 },
//     { name: "Shalu kumari", "Reg. no": "24CS0g", marks: 20 },
//     { name: "Aatm Gaurav", "Reg. no": "24CS101", marks: 36 },
//     { name: "Arun Kumar", "Reg. no": "24CS60", marks: 32 },
//     { name: "Radhika Kumari", "Reg. no": "24CS18", marks: 32 },
//     { name: "Sweety Kumari", "Reg. no": "24CS112", marks: 22 },
//     { name: "BULBUL SINHA", "Reg. no": "24CS77", marks: 14 },
//     { name: "Arya sinha", "Reg. no": "24CS64", marks: 16 },
//     { name: "Divya Kumari", "Reg. no": "24CS07", marks: 28 },
//     { name: "Prince Raj kashyap", "Reg. no": "24CS08p", marks: 24 },
//     { name: "Aditya kumar", "Reg. no": "24CS85", marks: 22 },
//     { name: "Shivam Kumar", "Reg. no": "24CS104", marks: 34 },
//     { name: "Amisha kumari", "Reg. no": "24CS29", marks: 16 },
//     { name: "Sameer Alam", "Reg. no": "24EC02", marks: 14 },
//     { name: "Khushi raj", "Reg. no": "24CS34", marks: 24 },
//     { name: "Shreya Srivashtwa", "Reg. no": "24CS16", marks: 20 },
//     { name: "Madhu Kumari", "Reg. no": "24CS88", marks: 28 },
//     { name: "Anshu Kumari", "Reg. no": "24CS19", marks: 24 },
//     { name: "Kajal kumari", "Reg. no": "24CS94", marks: 28 },
//     { name: "Prem kumar", "Reg. no": "24EC13", marks: 20 },
//     { name: "ANSHU RAJ", "Reg. no": "24EE38", marks: 20 },
//     { name: "Prince Sinha", "Reg. no": "24CS97", marks: 24 },
//     { name: "Ruchi kumari", "Reg. no": "24CS103", marks: 22 },
//     { name: "Suman kumari", "Reg. no": "24CS30", marks: 30 },
//     { name: "Dimpal kumari", "Reg. no": "24CS110", marks: 20 },
//     { name: "Ayush Anand", "Reg. no": "24CS80", marks: 22 },
//   ],
// };
const EXAM_RESULTS = {
  exam1: exam1.score,
  exam2: exam2.score,
};

// Process the results to add rank and department
const processExamResults = (results, totalMarks) => {
  return results
    .map((student) => ({
      ...student,
      department: student.roll_no.substring(2, 4) || "CS",
      percentile: ((student.marks / totalMarks) * 100).toFixed(1),
    }))
    .sort((a, b) => b.marks - a.marks)
    .map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
};

export function PreviousExamsModal({ onSelectExam }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });
  const [currentTab, setCurrentTab] = useState("all");

  // Get the selected exam's results
  const selectedExamData = selectedExam
    ? PREVIOUS_EXAMS.find((exam) => exam.id === selectedExam)
    : null;
  const examResults =
    selectedExam && EXAM_RESULTS[selectedExam]
      ? processExamResults(
          EXAM_RESULTS[selectedExam],
          selectedExamData?.totalMarks || 40
        )
      : [];

  // Filter results based on search query
  const filteredResults = examResults.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student["Reg. no"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortConfig.key === "rank") {
      return sortConfig.direction === "asc" ? a.rank - b.rank : b.rank - a.rank;
    } else if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "marks") {
      return sortConfig.direction === "asc"
        ? a.marks - b.marks
        : b.marks - a.marks;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Get top performers
  const topPerformers = examResults.slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ml-auto text-sm sm:text-base w-full"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Previous Exams
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Previous Exams Leaderboard</DialogTitle>
          <DialogDescription>
            View leaderboards from previous exams and competitions.
          </DialogDescription>
        </DialogHeader>

        {!selectedExam ? (
          // Exam selection view
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium">Select an Exam</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {PREVIOUS_EXAMS.map((exam) => (
                <Button
                  key={exam.id}
                  variant="outline"
                  className="h-auto p-3 sm:p-4 justify-start text-left flex flex-col items-start text-sm sm:text-base"
                  onClick={() => {
                    // If onSelectExam is provided, call it with the exam data
                    if (onSelectExam) {
                      onSelectExam(exam.data);
                      setIsOpen(false);
                    } else {
                      // Otherwise, just show the exam in the modal
                      setSelectedExam(exam.id);
                    }
                  }}
                >
                  <span className="font-medium truncate w-full">
                    {exam.name}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:justify-between w-full mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="truncate">
                      Date: {new Date(exam.date).toLocaleDateString()}
                    </span>
                    <span className="truncate">
                      Total Marks: {exam.totalMarks}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          // Exam results view
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold truncate">
                  {selectedExamData?.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="block sm:inline">
                    Date:{" "}
                    {new Date(selectedExamData?.date).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:inline"> | </span>
                  <span className="block sm:inline">
                    Total Marks: {selectedExamData?.totalMarks}
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                className="text-sm sm:text-base w-full sm:w-auto"
                onClick={() => setSelectedExam(null)}
              >
                Back to Exams
              </Button>
            </div>

            {examResults.length > 0 ? (
              <>
                {/* Top Performers */}
                {topPerformers.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {topPerformers.map((student, index) => (
                      <div
                        key={student["Reg. no"]}
                        className={`p-4 rounded-lg border ${
                          index === 0
                            ? "bg-amber-50 border-amber-200"
                            : index === 1
                            ? "bg-slate-50 border-slate-200"
                            : "bg-orange-50 border-orange-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant={
                              index === 0
                                ? "default"
                                : index === 1
                                ? "secondary"
                                : "outline"
                            }
                          >
                            Rank #{student.rank}
                          </Badge>
                          <Trophy
                            className={`h-5 w-5 ${
                              index === 0
                                ? "text-amber-500"
                                : index === 1
                                ? "text-slate-500"
                                : "text-orange-500"
                            }`}
                          />
                        </div>
                        <h4 className="font-medium">{student.name}</h4>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Reg. No: {student["Reg. no"]}
                          </span>
                          <span className="font-bold">
                            {student.marks} marks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or reg no..."
                      className="pl-8 text-sm sm:text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <Tabs
                  defaultValue="all"
                  onValueChange={setCurrentTab}
                  className="mb-3 sm:mb-4"
                >
                  <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                      All Students
                    </TabsTrigger>
                    <TabsTrigger value="top10" className="text-xs sm:text-sm">
                      Top 10
                    </TabsTrigger>
                    <TabsTrigger value="top25" className="text-xs sm:text-sm">
                      Top 25%
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Results Table */}
                <div className="rounded-md border overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">
                          <Button
                            variant="ghost"
                            className="p-0 h-8 font-semibold"
                            onClick={() => handleSort("rank")}
                          >
                            Rank
                            {sortConfig.key === "rank" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="p-0 h-8 font-semibold text-left"
                            onClick={() => handleSort("name")}
                          >
                            Name
                            {sortConfig.key === "name" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead>Reg. No</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            className="p-0 h-8 font-semibold"
                            onClick={() => handleSort("marks")}
                          >
                            Marks
                            {sortConfig.key === "marks" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${
                                  sortConfig.direction === "desc"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Percentile</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(currentTab === "all"
                        ? sortedResults
                        : currentTab === "top10"
                        ? sortedResults.slice(0, 10)
                        : sortedResults.slice(
                            0,
                            Math.ceil(sortedResults.length * 0.25)
                          )
                      ).map((student) => (
                        <TableRow
                          key={student["Reg. no"]}
                          className={student.rank <= 3 ? "bg-amber-50/50" : ""}
                        >
                          <TableCell className="font-medium">
                            {student.rank <= 3 ? (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800">
                                {student.rank}
                              </div>
                            ) : (
                              student.rank
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>{student["Reg. no"]}</TableCell>
                          <TableCell>
                            {student.department.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {student.marks}
                          </TableCell>
                          <TableCell className="text-right">
                            {student.percentile}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No results available for this exam.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
