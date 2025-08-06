"use client";

import type { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomStudentProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["students"]
>[number];

interface EnrollmentToolbarActionsProps {
  table: Table<ClassroomStudentProcedureOutput>;
  isActive: boolean;
}

export function EnrollmentDataTableActions({
  table,
  isActive,
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
        table.toggleAllRowsSelected(false);
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canUnEnrollStudent && (
        <Button
          variant="destructive"
          disabled={!isActive}
          size={"sm"}
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("unenroll"),
              description: t("delete_confirmation"),
              icon: (
                <Trash2
                  className="text-destructive size-4"
                  aria-hidden="true"
                />
              ),
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirmed) {
              toast.loading(t("Processing"), { id: 0 });
              unenrollStudentsMutation.mutate({
                studentId: selectedIds,
                classroomId: params.id,
              });
            }
          }}
        >
          <Trash />
          {t("unenroll")}
          <span className="ml-1">
            ({table.getSelectedRowModel().rows.length})
          </span>
        </Button>
      )}
    </>
  );
}
