import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { examService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Clock, Medal } from "lucide-react";

const ExamLeaderboard = () => {
  const { examId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await examService.getExamLeaderboard(examId);

        if (response.success) {
          setLeaderboard(response.data);
        } else {
          setError(response.error || "Failed to fetch leaderboard");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("An error occurred while fetching the leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [examId]);

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get rank badge
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Trophy className="mr-1 h-3 w-3" /> 1st
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
            <Medal className="mr-1 h-3 w-3" /> 2nd
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            <Medal className="mr-1 h-3 w-3" /> 3rd
          </Badge>
        );
      default:
        return <span className="text-sm font-medium">{rank}th</span>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty leaderboard
  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>No results available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No one has completed this exam yet. Be the first to take it!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>Top performers in this exam</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            Showing top {leaderboard.length} participants
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead className="text-right">Time Taken</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={`${entry.user.id}-${entry.rank}`}>
                <TableCell>{getRankBadge(entry.rank)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback>
                        {entry.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {entry.score}%
                </TableCell>
                <TableCell className="text-center">{entry.grade}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{formatDuration(entry.duration)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(entry.submittedAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExamLeaderboard;
