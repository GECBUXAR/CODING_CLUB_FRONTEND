"use client";

import React, { useState, useEffect } from "react";
import { useResponseEvaluation } from "@/contexts/response-evaluation-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExamResponseDetailModal from "./exam-response-detail-modal";
import { useNotification } from "@/contexts/notification-context";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Search,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ExamResponsesPanel = ({ examId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    getExamResponses,
    fetchExamResponses,
    loading,
    fetchError,
    computeExamStatistics,
  } = useResponseEvaluation();

  const { error } = useNotification();

  // Fetch exam responses when component mounts or examId changes
  useEffect(() => {
    let isMounted = true;

    if (examId) {
      // Use an async function inside useEffect to handle the promise
      const loadResponses = async () => {
        try {
          await fetchExamResponses(examId);
        } catch (err) {
          // This catch is just a safeguard; errors are handled in the context
          if (isMounted) {
            console.error("Error in response panel:", err);
          }
        }
      };

      loadResponses();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [examId, fetchExamResponses]); // Remove error from dependencies to avoid loops

  // Get responses from the context
  const responses = getExamResponses(examId);

  // Compute statistics
  const stats = computeExamStatistics(examId);

  // Filter responses based on activeTab and searchTerm
  const filteredResponses = responses.filter((response) => {
    // Filter by status if needed
    const statusMatch = activeTab === "all" || response.status === activeTab;

    // Filter by search term if provided
    const searchMatch = searchTerm
      ? response.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return statusMatch && searchMatch;
  });

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        <p className="mt-4 text-slate-500">Loading exam responses...</p>
      </div>
    );
  }

  // Render error state
  if (fetchError && responses.length === 0) {
    return (
      <div className="p-8 border border-red-200 rounded-md bg-red-50 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error Loading Responses
        </h3>
        <p className="text-red-600 mb-4">
          {fetchError || "Failed to fetch exam responses."}
        </p>
        <Button
          variant="outline"
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
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          No responses yet
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          When students submit their responses to this exam, they will appear
          here.
        </p>
      </div>
    );
  }

  // Handle opening the detail modal
  const handleViewResponse = (responseId) => {
    setSelectedResponseId(responseId);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Status message for debugging */}
      {fetchError && (
        <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Warning: Some data couldn't be loaded
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                {fetchError}. Some functionality may be limited.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Exam Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-slate-100">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white"
                >
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
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                  value="graded"
                  className="data-[state=active]:bg-white"
                >
                  Graded
                </TabsTrigger>
              </TabsList>

              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {filteredResponses.length > 0 ? (
                renderResponsesTable(filteredResponses, handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-slate-500">
                    No responses match your filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {filteredResponses.length > 0 ? (
                renderResponsesTable(filteredResponses, handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-slate-500">
                    No responses match your filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="partially_graded" className="mt-0">
              {filteredResponses.length > 0 ? (
                renderResponsesTable(filteredResponses, handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-slate-500">
                    No responses match your filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="graded" className="mt-0">
              {filteredResponses.length > 0 ? (
                renderResponsesTable(filteredResponses, handleViewResponse)
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-slate-500">
                    No responses match your filters.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Response Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Average Score:</span>
                  <Badge
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Evaluation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
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

      {/* Detail Modal */}
      {selectedResponseId && (
        <ExamResponseDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            // Refetch responses to get updated data
            fetchExamResponses(examId);
          }}
          examId={examId}
          responseId={selectedResponseId}
        />
      )}
    </div>
  );
};

// Helper function to render responses table
const renderResponsesTable = (responses, onViewResponse) => {
  if (!responses.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No responses found matching the criteria.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((response) => (
            <tr key={response.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">
                  {response.student?.name || "Anonymous"}
                </div>
                <div className="text-sm text-gray-500">
                  {response.student?.email || "No email"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(response.submittedAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.status === "evaluated" ? (
                  <Badge variant="success">Evaluated</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.finalScore !== undefined ? (
                  <Badge
                    variant={
                      response.finalScore >= 70 ? "success" : "destructive"
                    }
                  >
                    {response.finalScore}%
                  </Badge>
                ) : (
                  <span className="text-gray-500">--</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button size="sm" onClick={() => onViewResponse(response.id)}>
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
