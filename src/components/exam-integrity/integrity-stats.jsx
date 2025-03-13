import React from "react";
import { useExamIntegrity } from "./exam-integrity-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  AlertTriangle,
  Maximize,
  Eye,
  Fullscreen,
  Wifi,
  WifiOff,
  Monitor,
  Fingerprint,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Component to display integrity statistics for live exams
export function LiveIntegrityStats() {
  const {
    isIntegrityModeActive,
    focusViolations,
    fullscreenViolations,
    advancedViolations,
    isFullscreenSupported,
    networkStatus,
    detectedVirtualization,
    detectedDevTools,
    detectedScreenSharing,
    accessibilityMode,
  } = useExamIntegrity();

  if (!isIntegrityModeActive) return null;

  const totalViolations =
    focusViolations + fullscreenViolations + advancedViolations;
  const severityLevel =
    totalViolations === 0 ? "low" : totalViolations < 3 ? "medium" : "high";

  const severityColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-amber-600 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };

  return (
    <TooltipProvider>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Shield className="h-4 w-4 mr-2 text-indigo-500" />
          <h3 className="text-sm font-medium">Exam Integrity Monitor</h3>
          <div className="ml-auto flex items-center gap-2">
            {accessibilityMode && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                Accessibility Mode
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {isFullscreenSupported ? "Secure Mode" : "Limited Security"}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${
                networkStatus === "online"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {networkStatus === "online" ? (
                <span className="flex items-center">
                  <Wifi className="h-3 w-3 mr-1" /> Online
                </span>
              ) : (
                <span className="flex items-center">
                  <WifiOff className="h-3 w-3 mr-1" /> Offline
                </span>
              )}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <Eye className="h-3 w-3 mr-1 text-slate-500" />
              <span>Focus violations: {focusViolations}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Times you navigated away from the exam</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <Fullscreen className="h-3 w-3 mr-1 text-slate-500" />
              <span>Fullscreen violations: {fullscreenViolations}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Times you exited fullscreen mode</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Advanced Violations Section */}
        {(advancedViolations > 0 ||
          detectedVirtualization ||
          detectedDevTools ||
          detectedScreenSharing) && (
          <div className="grid grid-cols-2 gap-2 text-xs mt-1 mb-2">
            {detectedVirtualization && (
              <Tooltip>
                <TooltipTrigger className="flex items-center text-red-600">
                  <Monitor className="h-3 w-3 mr-1" />
                  <span>Virtualization detected</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Virtual machine or emulation detected</p>
                </TooltipContent>
              </Tooltip>
            )}

            {detectedDevTools && (
              <Tooltip>
                <TooltipTrigger className="flex items-center text-red-600">
                  <Fingerprint className="h-3 w-3 mr-1" />
                  <span>Developer tools detected</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browser developer tools were opened</p>
                </TooltipContent>
              </Tooltip>
            )}

            {detectedScreenSharing && (
              <Tooltip>
                <TooltipTrigger className="flex items-center text-red-600">
                  <Monitor className="h-3 w-3 mr-1" />
                  <span>Screen sharing detected</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Screen recording or sharing was detected</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        {totalViolations > 0 && (
          <div className="mt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">
                Integrity level
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${severityColors[severityLevel]}`}
              >
                {totalViolations} violation{totalViolations !== 1 ? "s" : ""}
              </span>
            </div>
            <Progress
              value={
                severityLevel === "low"
                  ? 90
                  : severityLevel === "medium"
                  ? 50
                  : 15
              }
              className={`h-1.5 ${
                severityLevel === "low"
                  ? "bg-green-100"
                  : severityLevel === "medium"
                  ? "bg-amber-100"
                  : "bg-red-100"
              }`}
              indicatorClassName={
                severityLevel === "low"
                  ? "bg-green-500"
                  : severityLevel === "medium"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }
            />
            {severityLevel === "high" && (
              <p className="text-xs text-red-600 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High violation count may result in automatic submission
              </p>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Post-exam integrity report for review purposes
export function IntegrityReport({
  integrityData,
  showDetails = false,
  accessibilityAccommodationsUsed = false,
}) {
  const {
    focusViolations = 0,
    fullscreenViolations = 0,
    advancedViolations = 0,
    networkDisconnections = 0,
    detectedVirtualization = false,
    detectedDevTools = false,
    detectedScreenSharing = false,
    timestamps = [], // Array of violation timestamps
  } = integrityData || {};

  const totalViolations =
    focusViolations + fullscreenViolations + advancedViolations;

  const severityLevel =
    totalViolations === 0
      ? "none"
      : totalViolations < 2
      ? "low"
      : totalViolations < 5
      ? "medium"
      : "high";

  const severityColorClass = {
    none: "bg-green-50 border-green-200 text-green-800",
    low: "bg-green-50 border-green-200 text-green-800",
    medium: "bg-amber-50 border-amber-200 text-amber-800",
    high: "bg-red-50 border-red-200 text-red-800",
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className={`border ${severityColorClass[severityLevel]}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Exam Integrity Report
          </CardTitle>
          {accessibilityAccommodationsUsed && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Accessibility Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">
                Focus violations:
              </span>
              <p className="font-medium">{focusViolations}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Fullscreen violations:
              </span>
              <p className="font-medium">{fullscreenViolations}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Advanced violations:
              </span>
              <p className="font-medium">{advancedViolations}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Network disconnections:
              </span>
              <p className="font-medium">{networkDisconnections}</p>
            </div>
          </div>

          {(detectedVirtualization ||
            detectedDevTools ||
            detectedScreenSharing) && (
            <>
              <div className="h-px bg-muted my-2" />
              <div className="space-y-1">
                <p className="text-xs font-medium">Advanced detections:</p>
                {detectedVirtualization && (
                  <p className="text-xs text-red-600 flex items-center">
                    <Monitor className="h-3 w-3 mr-1" />
                    Virtualization detected
                  </p>
                )}
                {detectedDevTools && (
                  <p className="text-xs text-red-600 flex items-center">
                    <Fingerprint className="h-3 w-3 mr-1" />
                    Developer tools detected
                  </p>
                )}
                {detectedScreenSharing && (
                  <p className="text-xs text-red-600 flex items-center">
                    <Monitor className="h-3 w-3 mr-1" />
                    Screen sharing detected
                  </p>
                )}
              </div>
            </>
          )}

          {showDetails && timestamps.length > 0 && (
            <>
              <div className="h-px bg-muted my-2" />
              <div>
                <p className="text-xs font-medium mb-1">Violation timeline:</p>
                <ul className="text-xs space-y-1 ml-5 list-disc">
                  {timestamps.map((event, index) => (
                    <li key={index}>
                      {formatTimestamp(event.timestamp)} - {event.type}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="h-px bg-muted my-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs">Integrity level:</span>
            <Badge
              variant="outline"
              className={severityColorClass[severityLevel]}
            >
              {severityLevel.charAt(0).toUpperCase() + severityLevel.slice(1)}
            </Badge>
          </div>
          {accessibilityAccommodationsUsed && (
            <p className="text-xs text-blue-600 mt-2">
              Note: This exam was taken with accessibility accommodations
              enabled.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
