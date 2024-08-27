"use client";

import { useParams } from "next/navigation";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import type {Table} from "@tanstack/react-table";
import type { inferProcedureOutput } from "@trpc/server";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { routes } from "~/configs/routes";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type ClassroomGetAssignemntProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["assignments"]>
>[number];

interface ToolbarActionsProps {
  table: Table<ClassroomGetAssignemntProcedureOutput>;
}

export function AssignmentDataTableActions({ table }: ToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams();
  const { openAlert, closeAlert } = useAlert();
  const deleteAssignemntMutation = api.assignment.delete.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={() => {
            openAlert({
              title: t("delete"),
              description: t("delete_confirmation"),
              onConfirm: () => {
                const assignmentIds = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original.id);

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
                  },
                );
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
