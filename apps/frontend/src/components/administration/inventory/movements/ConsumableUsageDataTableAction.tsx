"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import type { Table } from "@tanstack/react-table";
import { toast } from "sonner";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";

export function ConsumableUsageDataTableAction({
  table,
}: {
  table: Table<RouterOutputs["inventory"]["consumableUsages"][number]>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const { t } = useLocale();
  const canDeleteInventory = useCheckPermission(
    "inventory",
    PermissionAction.DELETE
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteConsumableMutation = useMutation(
    trpc.inventory.deleteUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const confirm = useConfirm();

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteInventory && (
        <Button
          size={"sm"}
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              const selectedItems = rows.map((row) => row.original);
              selectedItems.forEach((item) => {
                deleteConsumableMutation.mutate(item.id);
              });
            }
          }}
          variant="destructive"
        >
          <Trash />
          {t("delete")}
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
