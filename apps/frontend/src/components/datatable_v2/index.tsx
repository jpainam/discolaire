"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePaginationV2 } from "~/components/datatable_v2/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { useDataTableSettings } from "~/stores/data-table";

export { DataTablePaginationV2 } from "~/components/datatable_v2/data-table-pagination";
export { DataTableToolbarV2 } from "~/components/datatable_v2/data-table-toolbar";
export { DataTableViewOptionsV2 } from "~/components/datatable_v2/data-table-view-options";
export type {
  DataTableFilterField,
  Option,
} from "~/components/datatable_v2/types";

export interface DataTableState {
  sorting: SortingState;
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  rowSelection: RowSelectionState;
}

interface UseDataTableV2Props<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageSize?: number;
  rowCount?: number;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  columnVisibilityKey?: string;
  initialState?: Partial<DataTableState>;
  onStateChange?: (state: DataTableState) => void;
}

export function useDataTableV2<TData, TValue>({
  data,
  columns,
  pageSize = 30,
  rowCount,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  columnVisibilityKey,
  initialState,
  onStateChange,
}: UseDataTableV2Props<TData, TValue>) {
  const storedColumnVisibility = useDataTableSettings((state) =>
    columnVisibilityKey
      ? state.columnVisibilityByKey[columnVisibilityKey]
      : undefined,
  );
  const setColumnVisibilitySetting = useDataTableSettings(
    (state) => state.setColumnVisibility,
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      storedColumnVisibility ?? initialState?.columnVisibility ?? {},
    );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );
  const [globalFilter, setGlobalFilter] = React.useState(
    initialState?.globalFilter ?? "",
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? pageSize,
  });

  const tableState = React.useMemo(
    () => ({
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    }),
    [
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
    ],
  );

  const resolvedRowCount = rowCount ?? data.length;
  const resolvedPageCount =
    pageCount ?? Math.ceil(resolvedRowCount / pagination.pageSize);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getFacetedUniqueValues: manualFiltering
      ? undefined
      : getFacetedUniqueValues(),
    state: tableState,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount: manualPagination ? resolvedPageCount : undefined,
    rowCount: manualPagination ? resolvedRowCount : undefined,
  });

  React.useEffect(() => {
    onStateChange?.(tableState);
  }, [tableState, onStateChange]);

  React.useEffect(() => {
    if (!columnVisibilityKey) return;
    setColumnVisibilitySetting(columnVisibilityKey, columnVisibility);
  }, [columnVisibility, columnVisibilityKey, setColumnVisibilitySetting]);

  return { table, state: tableState };
}

interface DataTableV2Props<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTableV2<TData>({
  table,
  toolbar,
  footer,
  isLoading = false,
  emptyMessage = "No results.",
  children,
  className,
  ...props
}: DataTableV2Props<TData>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {toolbar ? <div>{toolbar}</div> : null}
      {children}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    style={{ width: `${header.getSize()}px` }}
                    key={`${header.id}-${index}`}
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
                colSpan={table.getVisibleLeafColumns().length}
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
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={`${cell.id}-${index}`}
                    className="h-[inherit] last:py-0"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>
      {footer ?? <DataTablePaginationV2 table={table} />}
    </div>
  );
}
