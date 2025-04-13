import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(
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
          role="switch"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
            "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            checked ? "bg-primary" : "bg-input"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block size-4 rounded-full bg-background shadow-lg transition-transform",
              checked ? "translate-x-4" : "translate-x-0"
            )}
          />
        </div>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
