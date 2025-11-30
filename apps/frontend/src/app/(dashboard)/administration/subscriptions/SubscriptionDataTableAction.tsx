"use client";

import type { Table } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function SubscriptionDataTableAction({
  table,
}: {
  table: Table<RouterOutputs["subscription"]["all"][number]>;
}) {
  const confirm = useConfirm();

  const t = useTranslations();

  const canDeleteSubscription = useCheckPermission(
    "subscription",
    PermissionAction.DELETE,
  );
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const deleteSubscriptionMutation = useMutation(
    trpc.subscription.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subscription.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.subscription.count.pathFilter(),
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
          size={"sm"}
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
          <Trash2 />
          {t("delete")}
          <Badge className="size-4">
            {table.getSelectedRowModel().rows.length}
          </Badge>
        </Button>
      )}
    </>
  );
}
