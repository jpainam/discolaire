"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function InventoryDataTableAction({
  table,
}: {
  table: Table<RouterOutputs["inventory"]["all"][number]>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const { t } = useLocale();
  const canDeleteInventory = useCheckPermission(
    "inventory",
    PermissionAction.DELETE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteAssetMutation = useMutation(
    trpc.inventory.deleteAsset.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const deleteConsumableMutation = useMutation(
    trpc.inventory.deleteConsumable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
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
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              const selectedItems = rows.map((row) => row.original);
              selectedItems.forEach((item) => {
                if (item.type === "ASSET") {
                  deleteAssetMutation.mutate(item.id);
                } else {
                  deleteConsumableMutation.mutate(item.id);
                }
              });
            }
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
