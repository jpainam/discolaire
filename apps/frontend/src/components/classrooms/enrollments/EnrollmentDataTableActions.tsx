"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { exportTableToCSV } from "~/lib/export";
import { api } from "~/trpc/react";

type ClassroomStudentProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["students"]
>[number];

interface EnrollmentToolbarActionsProps {
  table: Table<ClassroomStudentProcedureOutput>;
}

export function EnrollmentDataTableActions({
  table,
}: EnrollmentToolbarActionsProps) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const confirm = useConfirm();
  const utils = api.useUtils();
  //const rows = table.getFilteredSelectedRowModel().rows;
  const canUnEnrollStudent = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:enrollment"
  );
  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  const unenrollStudentsMutation =
    api.enrollment.deleteByStudentIdClassroomId.useMutation({
      onSettled: () => utils.classroom.students.invalidate(params.id),
      onSuccess: () => {
        toast.success(t("unenrolled_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    });

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canUnEnrollStudent && (
        <Button
          variant="destructive"
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("unenroll"),
              description: t("delete_confirmation"),
              icon: (
                <Trash2
                  className="size-4 text-destructive"
                  aria-hidden="true"
                />
              ),
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirmed) {
              toast.loading(t("unenrolling"), { id: 0 });
              unenrollStudentsMutation.mutate({
                studentId: selectedIds,
                classroomId: params.id,
              });
            }
          }}
        >
          <Trash2 />
          {t("delete")}
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              exportTableToCSV(table, {
                filename: "students",
                excludeColumns: ["select", "actions"],
              });
            }}
          >
            Export in csv
          </DropdownMenuItem>
          <DropdownMenuItem>Export in excel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
