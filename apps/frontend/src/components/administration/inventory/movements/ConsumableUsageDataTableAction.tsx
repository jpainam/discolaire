"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function ConsumableUsageDataTableAction({
  table,
}: {
  table: Table<RouterOutputs["inventory"]["consumableUsages"][number]>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const t = useTranslations();
  const canDeleteInventory = useCheckPermission("inventory.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteConsumableMutation = useMutation(
    trpc.inventory.deleteUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const confirm = useConfirm();

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteInventory && (
        <Button
          size={"sm"}
          onClick={async () => {
            await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),

              onConfirm: async () => {
                const selectedItems = rows.map((row) => row.original);
                await Promise.all(
                  selectedItems.map(async (item) => {
                    await deleteConsumableMutation.mutateAsync(item.id);
                  }),
                );
              },
            });
          }}
          variant="destructive"
        >
          <Trash />
          {t("delete")}
          <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
