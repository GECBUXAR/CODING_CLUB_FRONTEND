import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Consistent page header component for admin pages
 * 
 * @param {Object} props
 * @param {string} props.title - The page title
 * @param {string} props.description - The page description
 * @param {Array} props.actions - Array of action button configurations
 */
export function PageHeader({ title, description, actions = [] }) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "default"}
              className={`gap-2 ${action.className || ""}`}
              disabled={action.disabled}
            >
              {action.icon && action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
