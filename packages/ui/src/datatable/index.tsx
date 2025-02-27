"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTablePagination } from "@repo/ui/datatable/data-table-pagination";
import { cn } from "@repo/ui/lib/utils";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  defaultPageSize?: number;
  rowCount?: number;
}
export function useDataTable<TData, TValue>({
  data,
  columns,
  defaultPageSize,
  rowCount,
}: UseDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sortBy, setSortBy] = useQueryState("sortBy");
  const [sortDirection, setSortDirection] = useQueryState("sortDirection");
  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(defaultPageSize ?? 30),
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: sortBy ?? "",
      desc: sortDirection === "desc",
    },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Prevent resetting the page on initial render
    if (!mounted) {
      setMounted(true);
      return;
    }
    void setPageIndex(pagination.pageIndex);
    void setPageSize(pagination.pageSize);
    void setSortBy(sorting[0]?.id ?? null);
    void setSortDirection(sorting[0]?.desc ? "desc" : "asc");
  }, [
    mounted,
    pagination,
    setPageIndex,
    setPageSize,
    setSortBy,
    setSortDirection,
    sortBy,
    sortDirection,
    sorting,
  ]);

  const table = useReactTable({
    data,
    columns,
    rowCount: rowCount ?? data.length,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return { table };
}

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null;
  isLoading?: boolean;
}
export function DataTable<TData>({
  table,
  isLoading = false,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}

      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    style={{ width: `${header.getSize()}px` }}
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-sidebar border-border relative h-9 border-y select-none first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-accent/50 h-px border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-[inherit] last:py-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
