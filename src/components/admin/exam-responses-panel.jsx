import React, { useState, useEffect } from "react";
import { useResponseEvaluation } from "../../contexts/response-evaluation-context";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ExamResponseDetailModal from "./exam-response-detail-modal";
import { useNotification } from "../../contexts/notification-context";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Search,
  AlertCircle,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

const ExamResponsesPanel = ({ examId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    getLocalExamResponses,
    fetchExamResponses,
    loading,
    fetchError,
    computeExamStatistics,
  } = useResponseEvaluation();

  const { error } = useNotification();

  // Fetch exam responses when component mounts or examId changes
  useEffect(() => {
    let isMounted = true;

    const loadResponses = async () => {
      if (!examId) return;

      try {
        await fetchExamResponses(examId);
      } catch (error) {
        if (isMounted) {
          error("Failed to load exam responses");
        }
      }
    };

    loadResponses();

    return () => {
      isMounted = false;
    };
  }, [examId, fetchExamResponses]);

  // Get responses and stats
  const responses = getLocalExamResponses(examId) || [];
  const stats = computeExamStatistics(examId) || {
    totalResponses: 0,
    evaluatedResponses: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
  };

  // Filter responses based on search term and tab
  const filteredResponses = () => {
    return responses.filter((response) => {
      // Filter by status if needed
      const statusMatch = activeTab === "all" || response.status === activeTab;

      // Filter by search term if provided
      const searchMatch = searchTerm
        ? response.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          response.userId?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return statusMatch && searchMatch;
    });
  };

  // Handle view/evaluate response
  const handleViewResponse = (responseId) => {
    setSelectedResponseId(responseId);
    setDetailModalOpen(true);
  };

  // Render loading state
  if (loading && !responses.length) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4" />
        <p className="text-slate-600">Loading exam responses...</p>
      </div>
    );
  }

  // Render error state
  if (fetchError && responses.length === 0) {
    return (
      <div className="p-8 border border-red-200 rounded-md bg-red-50 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Error Loading Responses
        </h3>
        <p className="text-red-600 mb-4">
          {fetchError || "Failed to fetch exam responses."}
        </p>
        <Button
          variant="outline"
          size="default"
          onClick={() => fetchExamResponses(examId)}
          className="bg-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Render empty state
  if (responses.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-slate-300 rounded-md">
        <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          No Responses Yet
        </h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          There are currently no responses for this exam. Responses will appear
          here once students begin submitting their answers.
        </p>
        <Button
          variant="outline"
          size="default"
          onClick={() => fetchExamResponses(examId)}
          className="bg-white"
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by student name or ID..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="default"
          onClick={() => fetchExamResponses(examId)}
          className="whitespace-nowrap"
        >
          Refresh List
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Exam Responses</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Responses ({responses.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-white"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="partially_graded"
                className="data-[state=active]:bg-white"
              >
                Partially Graded
              </TabsTrigger>
              <TabsTrigger
                value="graded"
                className="data-[state=active]:bg-white"
              >
                Fully Graded
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {filteredResponses().length > 0 ? (
                renderResponsesTable(filteredResponses(), handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <Search className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No matching responses found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {filteredResponses().length > 0 ? (
                renderResponsesTable(filteredResponses(), handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No completed responses found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="partially_graded" className="mt-0">
              {filteredResponses().length > 0 ? (
                renderResponsesTable(filteredResponses(), handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    No partially graded responses found
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="graded" className="mt-0">
              {filteredResponses().length > 0 ? (
                renderResponsesTable(filteredResponses(), handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No graded responses found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Response Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Total Responses:
                  </span>
                  <span className="font-medium">{stats.totalResponses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Evaluated:</span>
                  <span className="font-medium">
                    {stats.evaluatedResponses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pending:</span>
                  <span className="font-medium">
                    {stats.totalResponses - stats.evaluatedResponses}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Scores Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Average Score:</span>
                  <Badge
                    className="ml-2"
                    variant={
                      stats.averageScore >= 70 ? "success" : "destructive"
                    }
                  >
                    {Math.round(stats.averageScore)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Highest Score:</span>
                  <span className="font-medium">
                    {Math.round(stats.highestScore)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Lowest Score:</span>
                  <span className="font-medium">
                    {Math.round(stats.lowestScore)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Evaluation Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-center h-16">
                  {stats.evaluatedResponses === 0 ? (
                    <div className="text-center text-gray-500">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-yellow-500" />
                      <span>No responses evaluated yet</span>
                    </div>
                  ) : stats.evaluatedResponses < stats.totalResponses ? (
                    <div className="text-center text-yellow-600">
                      <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-yellow-500" />
                      <span>
                        {stats.evaluatedResponses} of {stats.totalResponses}{" "}
                        evaluated
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-green-600">
                      <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                      <span>All responses evaluated</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail modal */}
      {detailModalOpen && (
        <ExamResponseDetailModal
          examId={examId}
          responseId={selectedResponseId}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedResponseId(null);
          }}
        />
      )}
    </div>
  );
};

// Helper function to render the responses table
const renderResponsesTable = (responses, onViewResponse) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Submitted
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Score
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((response) => (
            <tr key={response.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {response.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {response.userId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(response.submittedAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(response.submittedAt).toLocaleTimeString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.status === "evaluated" ? (
                  <Badge variant="success" className="font-normal">
                    Evaluated
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-normal">
                    Pending
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.finalScore !== undefined ? (
                  <Badge
                    variant={
                      response.finalScore >= 70 ? "success" : "destructive"
                    }
                    className="font-normal"
                  >
                    {response.finalScore}%
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button
                  size="sm"
                  variant="default"
                  className="ml-2"
                  onClick={() => onViewResponse(response.id)}
                >
                  {response.status === "evaluated" ? "View" : "Evaluate"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ExamResponsesPanel };
