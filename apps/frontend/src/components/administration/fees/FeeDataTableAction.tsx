"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>[number];

export function FeeDataTableActions({
  table,
}: {
  table: Table<FeeProcedureOutput>;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const feesMutation = api.fee.delete.useMutation({
    onSettled: () => utils.fee.invalidate(),
  });
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          size={"sm"}
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              confirmText: t("delete"),
              cancelText: t("cancel"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              const selectedRowIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);

              toast.promise(feesMutation.mutateAsync(selectedRowIds), {
                loading: t("deleting"),
                success: () => {
                  table.toggleAllRowsSelected(false);
                  return t("deleted_successfully");
                },
                error: (error) => {
                  return getErrorMessage(error);
                },
              });
            }
          }}
          variant={"destructive"}
        >
          <Trash2 />
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
