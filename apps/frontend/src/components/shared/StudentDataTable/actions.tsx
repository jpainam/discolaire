"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Plus } from "lucide-react";

import { Button } from "@repo/ui/button";

import type { Student } from "~/types/student";
import { exportTableToCSV } from "~/lib/export";

interface TasksTableToolbarActionsProps {
  table: Table<Student>;
}

export function StudentDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? null : null}
      {/* <CreateClassroomDialog
        prevClassrooms={table.getFilteredRowModel().rows}
      /> */}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Plus className="mr-2 size-4" aria-hidden="true" />
        Inscrire
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
