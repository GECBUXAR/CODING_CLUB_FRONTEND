import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Consistent empty state component for admin pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {Object} props.action - Action button configuration {label, onClick, icon}
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
      {icon && (
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
      
      {description && (
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          size={action.size || "default"}
          className={action.className || ""}
        >
          {action.icon && action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
