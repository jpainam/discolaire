/* eslint-disable @typescript-eslint/no-unnecessary-condition */

"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import type { DataTableFilterField } from "./types";
import { cn } from "..";
import { Button } from "../button";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "../data-table/data-table-view-options";
import { Input } from "../input";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  searchPlaceholder?: string;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { filterableColumns } = React.useMemo(() => {
    return {
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchPlaceholder && (
          <Input
            placeholder={searchPlaceholder}
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
            }}
            className="h-8 w-40 lg:w-64"
          />
        )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : "",
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
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
