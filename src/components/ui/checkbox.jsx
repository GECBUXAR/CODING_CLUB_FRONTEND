import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    // Handle the change event
    const handleChange = React.useCallback(
      (e) => {
        if (onCheckedChange) {
          onCheckedChange(e.target.checked);
        }
      },
      [onCheckedChange]
    );

    return (
      <div className={cn("relative inline-flex", className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "size-4 shrink-0 rounded-[4px] border shadow-xs transition-colors",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            checked ? "bg-primary border-primary" : "border-input"
          )}
        >
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
