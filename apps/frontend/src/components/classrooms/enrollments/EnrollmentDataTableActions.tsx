"use client";

import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";

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

  //const rows = table.getFilteredSelectedRowModel().rows;
  const canUnEnrollStudent = useCheckPermission(
    "enrollment",
    PermissionAction.DELETE,
  );
  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const unenrollStudentsMutation = useMutation(
    trpc.enrollment.deleteByStudentIdClassroomId.mutationOptions({
      onSuccess: async () => {
        toast.success(t("unenrolled_successfully"), { id: 0 });
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
          {t("unenroll")}
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
