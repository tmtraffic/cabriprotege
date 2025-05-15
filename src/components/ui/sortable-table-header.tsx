
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeaderProps<T> {
  label: string;
  field: keyof T;
  sortConfig: {
    key: keyof T;
    direction: 'ascending' | 'descending';
  } | null;
  onSort: (field: keyof T) => void;
  className?: string;
}

export function SortableTableHeader<T>({
  label,
  field,
  sortConfig,
  onSort,
  className,
}: SortableTableHeaderProps<T>) {
  return (
    <TableHead 
      onClick={() => onSort(field)}
      className={cn("cursor-pointer select-none hover:bg-muted/50", className)}
    >
      <div className="flex items-center">
        {label}
        {sortConfig?.key === field && (
          <span className="ml-2">
            {sortConfig.direction === 'ascending' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </TableHead>
  );
}
