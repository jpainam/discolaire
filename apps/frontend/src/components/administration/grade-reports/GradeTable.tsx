/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

// Define the data type
interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  currentGrade: number;
  lastGrade: number;
  assignments: number;
  status: "At Risk" | "Good Standing" | "Excellent";
}

// Sample data
const data: Student[] = [
  {
    id: "STU001",
    name: "Emma Johnson",
    email: "emma.j@school.edu",
    class: "Mathematics 101",
    currentGrade: 92,
    lastGrade: 90,
    assignments: 15,
    status: "Excellent",
  },
  {
    id: "STU002",
    name: "Liam Smith",
    email: "liam.s@school.edu",
    class: "Mathematics 101",
    currentGrade: 78,
    lastGrade: 82,
    assignments: 14,
    status: "Good Standing",
  },
  {
    id: "STU003",
    name: "Olivia Brown",
    email: "olivia.b@school.edu",
    class: "Science 202",
    currentGrade: 88,
    lastGrade: 85,
    assignments: 15,
    status: "Good Standing",
  },
  {
    id: "STU004",
    name: "Noah Davis",
    email: "noah.d@school.edu",
    class: "English 101",
    currentGrade: 65,
    lastGrade: 68,
    assignments: 12,
    status: "At Risk",
  },
  {
    id: "STU005",
    name: "Sophia Wilson",
    email: "sophia.w@school.edu",
    class: "History 303",
    currentGrade: 91,
    lastGrade: 89,
    assignments: 15,
    status: "Excellent",
  },
  {
    id: "STU006",
    name: "Jackson Miller",
    email: "jackson.m@school.edu",
    class: "Science 202",
    currentGrade: 72,
    lastGrade: 75,
    assignments: 13,
    status: "Good Standing",
  },
  {
    id: "STU007",
    name: "Ava Taylor",
    email: "ava.t@school.edu",
    class: "Mathematics 101",
    currentGrade: 58,
    lastGrade: 62,
    assignments: 10,
    status: "At Risk",
  },
  {
    id: "STU008",
    name: "Lucas Anderson",
    email: "lucas.a@school.edu",
    class: "English 101",
    currentGrade: 85,
    lastGrade: 83,
    assignments: 15,
    status: "Good Standing",
  },
  {
    id: "STU009",
    name: "Mia Thomas",
    email: "mia.t@school.edu",
    class: "History 303",
    currentGrade: 95,
    lastGrade: 93,
    assignments: 15,
    status: "Excellent",
  },
  {
    id: "STU010",
    name: "Ethan Jackson",
    email: "ethan.j@school.edu",
    class: "Science 202",
    currentGrade: 62,
    lastGrade: 65,
    assignments: 11,
    status: "At Risk",
  },
];

// Define the columns
const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => <div>{row.getValue("class")}</div>,
  },
  {
    accessorKey: "currentGrade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current Grade
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const grade = Number.parseFloat(row.getValue("currentGrade"));
      const lastGrade = row.original.lastGrade;
      const change = grade - lastGrade;

      return (
        <div className="flex items-center">
          <span className="font-medium">{grade}%</span>
          {change > 0 ? (
            <ArrowUpIcon className="ml-2 h-4 w-4 text-green-500" />
          ) : change < 0 ? (
            <ArrowDownIcon className="ml-2 h-4 w-4 text-red-500" />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "assignments",
    header: "Completed",
    cell: ({ row }) => <div>{row.getValue("assignments")}/15</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <Badge
          variant={
            status === "Excellent"
              ? "default"
              : status === "Good Standing"
                ? "outline"
                : "destructive"
          }
        >
          {`${status}`}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.id)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View student details</DropdownMenuItem>
            <DropdownMenuItem>Edit grades</DropdownMenuItem>
            <DropdownMenuItem>Generate report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function GradeTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter students..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
