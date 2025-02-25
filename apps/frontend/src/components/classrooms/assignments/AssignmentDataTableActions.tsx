"use client";

import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["assignments"]
>[number];

interface ToolbarActionsProps {
  table: Table<ClassroomGetAssignemntProcedureOutput>;
}

export function AssignmentDataTableActions({ table }: ToolbarActionsProps) {
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const confirm = useConfirm();
  const deleteAssignemntMutation = api.assignment.delete.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={async () => {
            const assignmentIds = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original.id);
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              toast.promise(
                deleteAssignemntMutation.mutateAsync(assignmentIds),
                {
                  loading: t("deleting"),
                  success: () => {
                    table.toggleAllRowsSelected(false);
                    return t("deleted_successfully");
                  },
                  error: (err) => {
                    return getErrorMessage(err);
                  },
                }
              );
            }
          }}
          variant="destructive"
          className="h-8"
          size="sm"
        >
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}

      <Button
        onClick={() => {
          router.push(routes.classrooms.assignments.create(params.id));
        }}
        className="h-8"
        variant="outline"
        size={"sm"}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        {t("new")}
      </Button>
      <Button
        variant="outline"
        className="h-8"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        {t("export")}
      </Button>
    </div>
  );
}
