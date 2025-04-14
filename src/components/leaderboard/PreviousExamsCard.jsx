import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, ChevronRight } from "lucide-react";
import { PreviousExamsModal } from "./PreviousExamsModal";

// Mock data for previous exams
const PREVIOUS_EXAMS = [
  { id: "exam1", name: "Data Structures Mid-Term", date: "2023-10-15", totalMarks: 40 },
  { id: "exam2", name: "Algorithms Quiz", date: "2023-11-05", totalMarks: 30 },
  { id: "exam3", name: "Programming Fundamentals", date: "2023-12-10", totalMarks: 50 },
  { id: "exam4", name: "Database Systems", date: "2024-01-20", totalMarks: 40 },
  { id: "exam5", name: "Web Development Basics", date: "2024-02-15", totalMarks: 40 },
];

export function PreviousExamsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Previous Exams</CardTitle>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <CardDescription>
          View results from previous exams and competitions
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ul className="space-y-2">
          {PREVIOUS_EXAMS.slice(0, 3).map((exam) => (
            <li key={exam.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
              <div>
                <p className="font-medium">{exam.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(exam.date).toLocaleDateString()}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <PreviousExamsModal />
      </CardFooter>
    </Card>
  );
}
