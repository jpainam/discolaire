"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";
import { useTranslations } from "use-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/base-badge";
import { getFullName } from "~/utils";

type SubjectProcedureOutput = RouterOutputs["subject"]["programs"][number];

export function useColumn(): {
  columns: ColumnDef<SubjectProcedureOutput, unknown>[];
} {
  const t = useTranslations();
  const columns: ColumnDef<SubjectProcedureOutput, unknown>[] = [
    {
      accessorKey: "course",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span> {p.course.reportName}</span>
              <Badge className="h-7 text-xs" variant="info" appearance="light">
                {p.course.shortName}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <AvatarState className="size-4" />
              <span className="text-xs">{getFullName(p.teacher)}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "classroom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("classroom")} />
      ),
      cell: ({ row }) => {
        const p = row.original;
        return <div>{p.classroom.reportName}</div>;
      },
    },

    {
      accessorKey: "program",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("program")} />
      ),
      size: 28,
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
      size: 28,
      cell: ({ row }) => {
        const p = row.original;
        return <div>{p.programs.length}</div>;
      },
    },
    {
      accessorKey: "program",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("sessions")} />
      ),
      size: 28,
      cell: ({ row }) => {
        const p = row.original;
        return <div>{p.programs.length}</div>;
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
