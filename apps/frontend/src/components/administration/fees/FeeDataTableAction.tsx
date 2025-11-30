"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>[number];

export function FeeDataTableActions({
  table,
}: {
  table: Table<FeeProcedureOutput>;
}) {
  const t = useTranslations();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const feesMutation = useMutation(
    trpc.fee.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
    }),
  );
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
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
              toast.loading(t("deleting"), { id: 0 });
              feesMutation.mutate(selectedRowIds);
            }
          }}
          variant={"destructive"}
        >
          <Trash2 />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      )}
    </>
  );
}
