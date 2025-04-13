import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn("grid gap-3", className)}
        {...props}
      />
    );
  }
);

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(
  (
    {
      className,
      value,
      checked,
      disabled,
      onCheckedChange,
      children,
      ...props
    },
    ref
  ) => {
    // Handle the change event
    const handleChange = React.useCallback(() => {
      if (onCheckedChange) {
        onCheckedChange(true);
      }
    }, [onCheckedChange]);

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-colors",
              "peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              checked ? "border-primary" : "border-input"
            )}
          >
            {checked && (
              <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
