"use client";

import React from "react";
import { useExamIntegrity } from "./exam-integrity-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Maximize, Eye, Fullscreen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Component to display integrity statistics for live exams
export function LiveIntegrityStats() {
  const {
    isIntegrityModeActive,
    focusViolations,
    fullscreenViolations,
    isFullscreenSupported,
  } = useExamIntegrity();

  if (!isIntegrityModeActive) return null;

  const totalViolations = focusViolations + fullscreenViolations;
  const severityLevel =
    totalViolations === 0 ? "low" : totalViolations < 3 ? "medium" : "high";

  const severityColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Shield className="h-4 w-4 mr-2 text-indigo-500" />
        <h3 className="text-sm font-medium">Exam Integrity Monitor</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {isFullscreenSupported ? "Secure Mode" : "Limited Security"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <Eye className="h-3 w-3 mr-1 text-slate-500" />
          <span>Focus violations: {focusViolations}</span>
        </div>
        <div className="flex items-center">
          <Fullscreen className="h-3 w-3 mr-1 text-slate-500" />
          <span>Fullscreen violations: {fullscreenViolations}</span>
        </div>
      </div>

      {totalViolations > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <div
              className={`text-xs font-medium flex items-center ${severityColors[severityLevel]}`}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              {totalViolations} integrity violation
              {totalViolations > 1 ? "s" : ""} detected
            </div>
            <span className="text-xs text-slate-500">
              Severity: {severityLevel}
            </span>
          </div>
          <Progress
            value={100}
            className={`h-1 ${
              severityLevel === "low"
                ? "bg-green-100"
                : severityLevel === "medium"
                ? "bg-amber-100"
                : "bg-red-100"
            }`}
          />
        </div>
      )}
    </div>
  );
}

// Component for displaying integrity report in review screens
export function IntegrityReport({ report, className }) {
  if (!report) return null;

  const {
    focusViolations = 0,
    fullscreenViolations = 0,
    forcedSubmission = false,
    submittedBy = "user",
  } = report;

  const totalViolations = focusViolations + fullscreenViolations;
  const severityLevel =
    totalViolations === 0 ? "low" : totalViolations < 3 ? "medium" : "high";

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2 text-indigo-500" />
          Exam Integrity Report
          {forcedSubmission && (
            <Badge variant="destructive" className="ml-auto text-xs">
              Force Submitted
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between border-r pr-2">
              <span className="text-slate-600">Focus violations:</span>
              <Badge
                variant={focusViolations > 0 ? "outline" : "secondary"}
                className="ml-auto"
              >
                {focusViolations}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Fullscreen violations:</span>
              <Badge
                variant={fullscreenViolations > 0 ? "outline" : "secondary"}
                className="ml-auto"
              >
                {fullscreenViolations}
              </Badge>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Severity:</span>
            <Badge
              className={
                severityLevel === "low"
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : severityLevel === "medium"
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }
            >
              {severityLevel.toUpperCase()}
            </Badge>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
            <span className="text-slate-600">Submitted by:</span>
            <Badge variant="outline">
              {submittedBy === "system" ? "System (Auto)" : "User"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
