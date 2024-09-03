"use client";

import type { Table } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";

import { routes } from "~/configs/routes";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

type ClassroomGradeSheetProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["gradesheets"]
>[number];

interface GradeSheetToolbarActionsProps {
  table: Table<ClassroomGradeSheetProcedureOutput>;
}

export function GradeSheetDataTableActions({
  table,
}: GradeSheetToolbarActionsProps) {
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const confirm = useConfirm();
  const { createQueryString } = useCreateQueryString();
  const deleteGradeSheetMutation = api.gradeSheet.delete.useMutation({
    onSettled: () => api.useUtils().invalidate(),
  });
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);

              toast.promise(deleteGradeSheetMutation.mutateAsync(selectedIds), {
                loading: t("deleting"),
                success: () => {
                  table.toggleAllRowsSelected(false);
                  return t("deleted_successfully");
                },
                error: (err) => {
                  return getErrorMessage(err);
                },
              });
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
          router.push(
            routes.classrooms.gradesheets.create(params.id) +
              "?" +
              createQueryString({}),
          );
        }}
        variant="default"
        size={"sm"}
        className="h-8"
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
