
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  keyField: string;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
  mobileCardRenderer?: (row: any, index: number) => ReactNode;
}

export function ResponsiveTable({
  data,
  columns,
  keyField,
  onRowClick,
  loading = false,
  emptyMessage = "Nenhum dado encontrado",
  mobileCardRenderer
}: ResponsiveTableProps) {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${isMobile ? 'bg-white rounded-lg shadow p-4' : 'h-12 bg-muted rounded'} animate-pulse`} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {data.map((row, index) => {
          if (mobileCardRenderer) {
            return <div key={row[keyField]}>{mobileCardRenderer(row, index)}</div>;
          }

          return (
            <Card key={row[keyField]} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4" onClick={() => onRowClick?.(row)}>
                <div className="space-y-2">
                  {columns.slice(0, 3).map((column) => (
                    <div key={column.key} className="flex justify-between">
                      <span className="text-sm text-muted-foreground font-medium">
                        {column.label}:
                      </span>
                      <span className="text-sm">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                  {columns.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row[keyField]} 
              className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
