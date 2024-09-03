"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditClassroom } from "./CreateEditClassroom";

type ClassroomProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<ClassroomProcedureOutput>;
}

export function ClassroomDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const classroomMutation = api.classroom.delete.useMutation({
    onSettled: () => api.useUtils().classroom.invalidate(),
  });
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          variant={"destructive"}
          onClick={async () => {
            const selectedIds = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original.id);

            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              toast.promise(classroomMutation.mutateAsync(selectedIds), {
                loading: t("deleting"),
                success: () => {
                  table.toggleAllRowsSelected(false);
                  return t("deleted_successfully");
                },
                error: (error) => {
                  console.error(error);
                  return getErrorMessage(error);
                },
              });
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
      <Button
        size={"sm"}
        className="h-8"
        onClick={() => {
          openSheet({
            className: "w-[700px]",
            title: <div className="p-2">{t("create")}</div>,
            view: <CreateEditClassroom />,
          });
        }}
      >
        <Plus className="mr-2 size-4" aria-hidden="true" />
        {t("new")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="h-8"
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
