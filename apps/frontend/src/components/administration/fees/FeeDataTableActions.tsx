"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import type {Table} from "@tanstack/react-table";
import type { inferProcedureOutput } from "@trpc/server";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type FeeProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["fee"]["all"]>
>[number];

export function FeeDataTableActions({
  table,
}: {
  table: Table<FeeProcedureOutput>;
}) {
  const { t } = useLocale();
  const { openAlert } = useAlert();
  const feesMutation = api.fee.deleteMany.useMutation();
  const utils = api.useUtils();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          size={"sm"}
          onClick={() => {
            openAlert({
              title: t("delete"),
              description: t("delete_confirmation"),
              onConfirm: () => {
                const selectedRowIds = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original.id);

                toast.promise(
                  feesMutation.mutateAsync({ ids: selectedRowIds }),
                  {
                    loading: t("deleting"),
                    success: () => {
                      table.toggleAllRowsSelected(false);
                      utils.fee.all.invalidate();
                      return t("deleted_successfully");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              },
            });
          }}
          variant={"destructive"}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}

      <Button
        variant="outline"
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
