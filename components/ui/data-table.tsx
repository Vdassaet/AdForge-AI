import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = "No data available", className }: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md border bg-card overflow-hidden shadow-sm", className)}>
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="border-b bg-muted/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 align-middle h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-muted p-3">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <span className="text-sm">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    {col.cell ? col.cell(item) : (item as Record<string, unknown>)[col.accessorKey as string] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
