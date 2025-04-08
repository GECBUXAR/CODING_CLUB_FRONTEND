import React from "react";
import { Search, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Consistent filter bar component for admin pages
 * 
 * @param {Object} props
 * @param {string} props.searchValue - Current search value
 * @param {Function} props.onSearchChange - Search change handler
 * @param {Array} props.filters - Array of filter configurations
 * @param {Function} props.onResetFilters - Reset filters handler
 */
export function FilterBar({ 
  searchValue = "", 
  onSearchChange,
  filters = [],
  onResetFilters,
  className = ""
}) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-start md:items-center p-4 rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-[240px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
        
        {filters.map((filter, index) => (
          <Select 
            key={index}
            value={filter.value} 
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      
      {onResetFilters && (
        <div className="w-full md:w-auto flex justify-end">
          <Button variant="ghost" onClick={onResetFilters} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
