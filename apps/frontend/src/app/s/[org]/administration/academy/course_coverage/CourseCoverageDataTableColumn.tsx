"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";
import { useTranslations } from "use-intl";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

type SubjectProcedureOutput = RouterOutputs["subject"]["programs"][number];

export function useColumn(): {
  columns: ColumnDef<SubjectProcedureOutput, unknown>[];
} {
  const t = useTranslations();
  const columns: ColumnDef<SubjectProcedureOutput, unknown>[] = [
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
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "course",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <Link
            className="line-clamp-1 hover:text-blue-600 hover:underline"
            href={"#"}
          >
            {p.course}
          </Link>
        );
      },
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("code")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return <Badge variant="secondary">{p.courseCode}</Badge>;
      },
    },

    {
      accessorKey: "program",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("program")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return <div>{p.programs.length}</div>;
      },
    },
    {
      accessorKey: "program",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("coverage")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div>
            {p.programs.length} / {p.sessions.length}
          </div>
        );
      },
    },
    {
      accessorKey: "program",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("sessions")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return <div>{p.sessions.length}</div>;
      },
    },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCell program={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
  return { columns };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ActionCell({ program }: { program: SubjectProcedureOutput }) {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye />
            Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
