"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useQueryState } from "nuqs";

import { Button } from "../button";
import { cn } from "../components";
import { Input } from "../components/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}
export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  searchPlaceholder?: string;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [searchQuery, setSearchQuery] = useQueryState("searchQuery");

  // Memoize computation of searchableColumns and filterableColumns
  const { filterableColumns } = React.useMemo(() => {
    return {
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.value && String(column.value)) && (
                  <DataTableFacetedFilter
                    key={String(column.value)}
                    column={table.getColumn(
                      column.value && String(column.value),
                    )}
                    title={column.label}
                    options={column.options ?? []}
                  />
                ),
            )}
          {isFiltered && (
            <Button
              aria-label="Reset filters"
              variant="ghost"
              className="h-8 px-2 lg:px-3"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
              <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <Input
          placeholder={"Search"}
          value={table.getState().globalFilter as string}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value);
            void setSearchQuery(event.target.value);
          }}
          className="h-8 w-40 lg:w-64"
        />
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
