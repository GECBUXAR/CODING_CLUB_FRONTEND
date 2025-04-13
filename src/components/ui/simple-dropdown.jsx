import * as React from "react";
import { cn } from "@/lib/utils";

const SimpleDropdown = React.forwardRef(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className={cn("relative inline-block text-left", className)} 
      {...props}
    >
      {React.Children.map(children, child => {
        if (child.type === SimpleDropdownTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (child.type === SimpleDropdownContent) {
          return isOpen ? React.cloneElement(child) : null;
        }
        return child;
      })}
    </div>
  );
});

SimpleDropdown.displayName = "SimpleDropdown";

const SimpleDropdownTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn("inline-flex justify-center items-center", className)}
      {...props}
    >
      {children}
    </button>
  );
});

SimpleDropdownTrigger.displayName = "SimpleDropdownTrigger";

const SimpleDropdownContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
        className
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
});

SimpleDropdownContent.displayName = "SimpleDropdownContent";

const SimpleDropdownItem = React.forwardRef(({ className, children, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});

SimpleDropdownItem.displayName = "SimpleDropdownItem";

const SimpleDropdownCheckboxItem = React.forwardRef(
  ({ className, children, checked, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          className
        )}
        onClick={handleClick}
        role="menuitemcheckbox"
        aria-checked={checked}
        {...props}
      >
        <span className="mr-2 h-4 w-4 flex items-center justify-center">
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
        {children}
      </button>
    );
  }
);

SimpleDropdownCheckboxItem.displayName = "SimpleDropdownCheckboxItem";

export {
  SimpleDropdown,
  SimpleDropdownTrigger,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownCheckboxItem
};
