"use client";

import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { useAlert } from "~/hooks/use-alert";
import { useSheet } from "~/hooks/use-sheet";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateEditStaff } from "./CreateEditStaff";

type StaffProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["staff"]["all"]>
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<StaffProcedureOutput>;
}

export function StaffDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { t } = useLocale();
  const { openAlert, closeAlert } = useAlert();
  const deleteManyStaffMutation = api.staff.deleteMany.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={() => {
            openAlert({
              title: t("delete"),
              description: t("delete_confirmation"),
              onConfirm: () => {
                const ids = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original.id);

                toast.promise(deleteManyStaffMutation.mutateAsync(ids), {
                  loading: t("deleting"),
                  success: () => {
                    table.toggleAllRowsSelected(false);
                    return t("deleted_successfully");
                  },
                  error: (err) => {
                    console.error(err);
                    return getErrorMessage(err);
                  },
                });
              },
              onCancel: () => {
                closeAlert();
              },
            });
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
          openSheet({
            className: "w-[750px]",
            title: t("create"),
            view: <CreateEditStaff />,
          });
        }}
        className="h-8"
        variant="default"
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
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
