"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useAlert } from "@repo/hooks/use-alert";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import CreateEditStudent from "./CreateEditStudent";

type StudentGetAllProcedureOutput = NonNullable<
  RouterOutputs["student"]["all"]
>[number];

interface StudentToolbarActionsProps {
  table: Table<StudentGetAllProcedureOutput>;
}

export function StudentDataTableActions({ table }: StudentToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { openAlert, closeAlert } = useAlert();
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteStudentMutation = api.student.delete.useMutation({
    onSettled: () => utils.student.invalidate(),
  });
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          variant={"destructive"}
          className="h-8"
          onClick={() => {
            const selectedStudentIds = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original.id);
            openAlert({
              title: t("delete"),
              description: t("delete_confirmation"),
              onConfirm: () => {
                toast.promise(
                  deleteStudentMutation.mutateAsync(selectedStudentIds),
                  {
                    loading: t("deleting"),
                    success: () => {
                      table.toggleAllRowsSelected(false);
                      closeAlert();
                      return t("deleted_successfully");
                    },
                    error: (error) => {
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
        variant={"default"}
        onClick={() => {
          openSheet({
            className: "w-[750px]",
            title: <div className="p-2">{t("create")}</div>,
            view: <CreateEditStudent />,
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
            filename: "students",
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
