"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { DeleteIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function SubscriptionDataTableAction({
  table,
}: {
  table: Table<RouterOutputs["notificationSubscription"]["all"][number]>;
}) {
  const confirm = useConfirm();

  const t = useTranslations();

  const canDeleteSubscription = useCheckPermission("subscription.delete");
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const deleteSubscriptionMutation = useMutation(
    trpc.notificationSubscription.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.notificationSubscription.count.pathFilter(),
        );
        table.toggleAllRowsSelected(false);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const rows = table.getFilteredSelectedRowModel().rows;

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteSubscription && (
        <Button
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });

            if (isConfirmed) {
              const selectedIds = rows.map((row) => row.original.id);
              toast.loading(t("deleting"), { id: 0 });
              deleteSubscriptionMutation.mutate(selectedIds);
            }
          }}
          variant={"destructive"}
        >
          <DeleteIcon />
          {t("delete")}
          <Badge className="size-4 rounded-full">
            {table.getSelectedRowModel().rows.length}
          </Badge>
        </Button>
      )}
    </>
  );
}
