
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
} from "@/components/ui/table";

interface StickyHeaderTableProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyHeaderTable({ children, className }: StickyHeaderTableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <Table className={className}>
        {children}
      </Table>
    </div>
  );
}

export function StickyTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <TableHeader className="sticky top-0 z-10 bg-background border-b">
      {children}
    </TableHeader>
  );
}

export { TableBody };
