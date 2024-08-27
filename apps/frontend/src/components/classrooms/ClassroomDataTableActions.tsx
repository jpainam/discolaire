"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import type {Table} from "@tanstack/react-table";
import type { inferProcedureOutput } from "@trpc/server";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateEditClassroom } from "./CreateEditClassroom";

type ClassroomProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["all"]>
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<ClassroomProcedureOutput>;
}

export function ClassroomDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { openAlert, closeAlert } = useAlert();
  const { t } = useLocale();
  const classroomMutation = api.classroom.delete.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        // <DeleteClassroomsDialog
        //   classrooms={table
        //     .getFilteredSelectedRowModel()
        //     .rows.map((row) => row.original)}
        //   onSuccess={() => table.toggleAllRowsSelected(false)}
        // />
        <Button
          variant={"destructive"}
          onClick={() => {
            const selectedClassrooms = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original);
            openAlert({
              title: t("delete"),
              description: `${t("delete_confirmation")} ${selectedClassrooms.map((cl) => cl.shortName).join(", ")}?`,
              onConfirm: () => {
                toast.promise(
                  Promise.all(
                    selectedClassrooms.map((cl) =>
                      classroomMutation.mutateAsync(cl.id),
                    ),
                  ),
                  {
                    loading: t("deleting"),
                    success: () => {
                      table.toggleAllRowsSelected(false);
                      closeAlert();
                      return t("deleted_successfully");
                    },
                    error: (error) => {
                      console.error(error);
                      return getErrorMessage(error);
                    },
                  },
                );
              },
              onCancel: () => {
                closeAlert();
                table.toggleAllRowsSelected(false);
              },
            });
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
      <Button
        size={"sm"}
        className="h-8"
        variant={"outline"}
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
