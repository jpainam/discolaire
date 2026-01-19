"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

import type { DataTableFilterField } from "./types";
import { DataTableFacetedFilter } from "~/components/datatable/data-table-faceted-filter";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { cn } from "~/lib/utils";

interface DataTableToolbarProps<
  TData,
> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  rightActions?: React.ReactNode;
}

export function DataTableToolbarV2<TData>({
  table,
  filterFields = [],
  searchPlaceholder = "Search...",
  onSearchChange,
  rightActions,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter);

  const filterableColumns = React.useMemo(() => {
    return filterFields.filter((field) => field.options.length);
  }, [filterFields]);

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-end gap-3",
        className,
      )}
      {...props}
    >
      <div className="mr-auto flex flex-1 items-center gap-2">
        <InputGroup className="w-full lg:w-96">
          <InputGroupInput
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter as string}
            onChange={(event) => {
              const value = event.target.value;
              table.setGlobalFilter(value);
              onSearchChange?.(value);
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {filterableColumns.map((column) =>
          table.getColumn(String(column.id)) ? (
            <DataTableFacetedFilter
              key={String(column.id)}
              column={table.getColumn(String(column.id))}
              title={column.label}
              options={column.options}
            />
          ) : null,
        )}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
              onSearchChange?.("");
            }}
          >
            Reset
            <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightActions}
        {children}
      </div>
    </div>
  );
}
