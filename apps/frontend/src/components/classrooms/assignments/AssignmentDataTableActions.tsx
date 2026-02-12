"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { getErrorMessage } from "~/lib/handle-error";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"]
>[number];

interface ToolbarActionsProps {
  table: Table<ClassroomGetAssignemntProcedureOutput>;
}

export function AssignmentDataTableActions({ table }: ToolbarActionsProps) {
  const t = useTranslations();

  const confirm = useConfirm();
  const trpc = useTRPC();
  const deleteAssignemntMutation = useMutation(
    trpc.assignment.delete.mutationOptions(),
  );

  const canDeleteAssignment = useCheckPermission("assignment.delete");
  return (
    <>
      {canDeleteAssignment &&
        table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            onClick={async () => {
              const assignmentIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);
              await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),

                onConfirm: async () => {
                  try {
                    await deleteAssignemntMutation.mutateAsync(assignmentIds);
                    table.toggleAllRowsSelected(false);
                    toast.success(t("deleted_successfully"), { id: 0 });
                  } catch (err) {
                    toast.error(getErrorMessage(err), { id: 0 });
                    throw err;
                  }
                },
              });
            }}
            variant="destructive"
          >
            <Trash2 />
            {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
    </>
  );
}
