import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";

/**
 * Consistent data table component for admin pages
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions
 * @param {Array} props.data - Array of data items
 * @param {boolean} props.loading - Whether the data is loading
 * @param {Object} props.emptyState - Configuration for empty state
 */
export function DataTable({ 
  columns, 
  data = [], 
  loading = false,
  emptyState,
  className = ""
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            {columns.map((col, index) => (
              <Skeleton 
                key={index} 
                className={`h-12 ${index === columns.length - 1 ? 'ml-auto' : ''} ${
                  col.width ? `w-[${col.width}]` : 'w-full'
                }`} 
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
      />
    );
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={column.className}
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-muted/50">
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.cellClassName}>
                  {column.cell ? column.cell(row) : row[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
