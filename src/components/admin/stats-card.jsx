import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Consistent stats card component for admin dashboards
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.subtitle - Optional subtitle text
 * @param {Object} props.trend - Optional trend data {value: string, direction: "up"|"down", label: string}
 * @param {Object} props.badge - Optional badge data {label: string, variant: string}
 * @param {number} props.progress - Optional progress value (0-100)
 */
export function StatsCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend, 
  badge,
  progress,
  className = ""
}) {
  return (
    <Card className={`border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(subtitle || trend) && (
          <div className="flex justify-between items-center mt-1">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            
            {trend && (
              <div className={`flex items-center text-xs font-medium ${
                trend.direction === "up" 
                  ? "text-green-600" 
                  : trend.direction === "down" 
                    ? "text-red-600" 
                    : "text-blue-600"
              }`}>
                {trend.icon && trend.icon}
                {trend.value}
              </div>
            )}
          </div>
        )}
        
        {progress !== undefined && (
          <div className="mt-3 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {badge && (
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-muted-foreground">{badge.label}</div>
            <Badge
              variant={badge.variant || "outline"}
              className={badge.className}
            >
              {badge.value}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
