import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreviousExamsCard } from "@/components/leaderboard/PreviousExamsCard";

// Mock leaderboard data (using the data you provided)
const LEADERBOARD_DATA = [
  { name: "ANKIT KUMAR THAKUR", roll_no: "24CS20", marks: 44 },
  { name: "Virat Raj", roll_no: "24CS107", marks: 41 },
  { name: "Harshit Kumar Thakur", roll_no: "24CS17", marks: 41 },
  { name: "RITIK KUMAR RAI", roll_no: "24EE20", marks: 39 },
  { name: "Nityanand Tiwari", roll_no: "24CS02", marks: 38 },
  { name: "VIKASH KUMAR YADAV", roll_no: "24CS42", marks: 35 },
  { name: "Ranjeet Kumar", roll_no: "24CS11", marks: 35 },
  { name: "Khushi raj", roll_no: "24CS34", marks: 35 },
  { name: "suman kumar", roll_no: "24cs30", marks: 35 },
  { name: "Pranav Prakash", roll_no: "24CS71", marks: 32 },
  { name: "Nisha Kumari", roll_no: "24CS09", marks: 32 },
  { name: "Suman Baitha", roll_no: "24CS72", marks: 32 },
  { name: "Ritesh Kumar", roll_no: "24cs49", marks: 30 },
  { name: "Nikhil Kumar Sharma", roll_no: "24EC19", marks: 30 },
  { name: "SIBU PATHAK", roll_no: "24CS55", marks: 30 },
  { name: "Divya Kumari", roll_no: "24cs07", marks: 29 },
  { name: "PRINCE RAJ KASHYAP", roll_no: "24CS08", marks: 29 },
  { name: "Anushka Deep", roll_no: "24CS14", marks: 26 },
  { name: "AYUSH ANAND", roll_no: "24CS80", marks: 26 },
  { name: "Anshu Kumari", roll_no: "24cs19", marks: 26 },
  { name: "Madhu Kumari", roll_no: "24CS88", marks: 26 },
  { name: "Arya sinha", roll_no: "24cs64", marks: 24 },
  { name: "Kajal kumari", roll_no: "24cs94", marks: 24 },
  { name: "Shivam Kumar", roll_no: "24CS104", marks: 23 },
  { name: "shalu kumari", roll_no: "24cs01", marks: 23 },
  { name: "Radhika kumari", roll_no: "24cs18", marks: 23 },
  { name: "AKHIL TIWARI", roll_no: "24CS24", marks: 23 },
  { name: "Kunal Kumar", roll_no: "24CS70", marks: 21 },
  { name: "RIYA KUMARI", roll_no: "24CS63", marks: 21 },
  { name: "juhi kumari", roll_no: "24cs62", marks: 20 },
  { name: "BULBUL SINHA", roll_no: "24CS77", marks: 20 },
  { name: "Shubham Raj", roll_no: "24cs104p", marks: 20 },
  { name: "Amisha Kumari", roll_no: "24CS29", marks: 18 },
  { name: "Tamanna", roll_no: "24CS96", marks: 17 },
  { name: "Suman kumar", roll_no: "24CS69", marks: 17 },
  { name: "Prince Kumar", roll_no: "24CS111P", marks: 17 },
  { name: "Arun Kumar", roll_no: "24CS60", marks: 15 },
  { name: "Manav Raj Kashyap", roll_no: "24cs56", marks: 15 },
  { name: "prince sinha", roll_no: "24CS97", marks: 14 },
  { name: "Ruchi Kumari", roll_no: "24cs103", marks: 14 },
  { name: "Pushpanjali kumari", roll_no: "24cs114", marks: 12 },
  { name: "Aditya Kumar", roll_no: "24CS85", marks: 12 },
  { name: "Anjali Kumari Shukla", roll_no: "24CS92", marks: 11 },
  { name: "Nidhi kumari", roll_no: "24cs106", marks: 8 },
  { name: "Kumari Riya", roll_no: "24CS100", marks: 8 },
  { name: "Priya Kumari", roll_no: "24CS75", marks: 6 },
  { name: "Aditya Tiwari", roll_no: "24CS26", marks: 3 },
  { name: "Archana kumari", roll_no: "24cs48", marks: 3 },
  { name: "Prince Raj", roll_no: "24Cs50p", marks: 3 },
  { name: "Rimjhim kumari", roll_no: "24cs61", marks: 3 },
  { name: "Afsana Praveen", roll_no: "24EC24", marks: 3 },
  { name: "Pravin Prakash", roll_no: "24CS86", marks: 3 },
  { name: "SWEETY KUMARI", roll_no: "24CS112", marks: 3 },
  { name: "Vandana kumari sharma", roll_no: "24EC29", marks: 3 },
  { name: "Shreya srivashtwa", roll_no: "24cs16", marks: 0 },
  { name: "Ankit kumar", roll_no: "24cs91", marks: 0 },
];

// Process the data to add rank and department
const processedData = LEADERBOARD_DATA.map((student) => ({
  ...student,
  department: student.roll_no.substring(2, 4) || "CS",
  percentile: ((student.marks / 50) * 100).toFixed(1),
}))
  .sort((a, b) => b.marks - a.marks)
  .map((student, index) => ({
    ...student,
    rank: index + 1,
  }));

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });
  const [currentTab, setCurrentTab] = useState("all");

  // Get unique departments
  const departmentsSet = new Set();
  processedData.forEach((student) =>
    departmentsSet.add(student.department.toUpperCase())
  );
  const departments = ["all", ...Array.from(departmentsSet)];

  // Filter and sort data
  const filteredData = processedData.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" ||
      student.department.toUpperCase() === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
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
  const topPerformers = processedData.slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Track your performance and see how you rank among your peers.
          </p>
        </div>
        <div className="w-full md:w-80">
          <PreviousExamsCard />
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topPerformers.map((student, index) => (
          <Card
            key={student.roll_no}
            className={`
            ${index === 0 ? "bg-amber-50 border-amber-200" : ""}
            ${index === 1 ? "bg-slate-50 border-slate-200" : ""}
            ${index === 2 ? "bg-orange-50 border-orange-200" : ""}
          `}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    index === 0
                      ? "default"
                      : index === 1
                      ? "secondary"
                      : "outline"
                  }
                  className="mb-2"
                >
                  Rank #{student.rank}
                </Badge>
                {index === 0 && <Trophy className="h-6 w-6 text-amber-500" />}
                {index === 1 && <Medal className="h-6 w-6 text-slate-500" />}
                {index === 2 && <Medal className="h-6 w-6 text-orange-500" />}
              </div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-muted-foreground">
                    Roll No: {student.roll_no}
                  </p>
                  <p className="text-muted-foreground">
                    Department: {student.department.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{student.marks}</p>
                  <p className="text-muted-foreground">marks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or roll no..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Department: {departmentFilter.toUpperCase()}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {departments.map((dept) => (
              <DropdownMenuItem
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={departmentFilter === dept ? "bg-accent" : ""}
              >
                {dept.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="top10">Top 10</TabsTrigger>
          <TabsTrigger value="top25">Top 25%</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leaderboard Table */}
      <div className="rounded-md border">
        <Table>
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
                        sortConfig.direction === "desc" ? "rotate-180" : ""
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
                        sortConfig.direction === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>Roll No</TableHead>
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
                        sortConfig.direction === "desc" ? "rotate-180" : ""
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
              ? sortedData
              : currentTab === "top10"
              ? sortedData.slice(0, 10)
              : sortedData.slice(0, Math.ceil(sortedData.length * 0.25))
            ).map((student) => (
              <TableRow
                key={student.roll_no}
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
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.roll_no}</TableCell>
                <TableCell>{student.department.toUpperCase()}</TableCell>
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
    </div>
    // </div>
  );
}
