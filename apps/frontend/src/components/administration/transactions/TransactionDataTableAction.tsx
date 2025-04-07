"use client";

import type { Table } from "@tanstack/react-table";
import React, { useCallback } from "react";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import type { RouterOutputs } from "@repo/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import FlatBadge from "~/components/FlatBadge";
import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["all"]
>[number];

export function TransactionDataTableAction({
  table,
}: {
  table: Table<TransactionAllProcedureOutput>;
}) {
  const { t } = useLocale();
  const rows = table.getFilteredSelectedRowModel().rows;

  const canDeleteTransaction = useCheckPermission(
    "transaction",
    PermissionAction.DELETE,
  );
  const { openModal } = useModal();

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateTransactionMutation = useMutation(
    trpc.transaction.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.transaction.pathFilter());
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      const selectedIds = rows.map((row) => row.original.id);
      const v = status as "PENDING" | "CANCELED" | "VALIDATED";
      updateTransactionMutation.mutate({
        transactionIds: selectedIds,
        status: v,
      });
    },
    [rows, updateTransactionMutation],
  );

  return (
    <>
      {rows.length > 0 && canDeleteTransaction && (
        <div className="flex flex-row items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"outline"}>
                {t("Change status")}
                {updateTransactionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  toast.loading(t("updating"), { id: 0 });
                  handleStatusChange("VALIDATED");
                }}
              >
                <FlatBadge
                  variant={"green"}
                  className="flex items-center gap-2"
                >
                  <CheckCircledIcon />
                  {t("validate")}
                </FlatBadge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  toast.loading(t("updating"), { id: 0 });
                  handleStatusChange("CANCELED");
                }}
              >
                <FlatBadge variant={"red"} className="flex items-center gap-2">
                  <CrossCircledIcon />
                  {t("cancel")}
                </FlatBadge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  toast.loading(t("updating"), { id: 0 });
                  handleStatusChange("PENDING");
                }}
              >
                <FlatBadge
                  variant={"yellow"}
                  className="flex items-center gap-2"
                >
                  <StopwatchIcon /> {t("pending")}
                </FlatBadge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size={"sm"}
            onClick={() => {
              const selectedIds = rows.map((row) => row.original.id);
              openModal({
                title: t("delete"),
                view: <DeleteTransaction transactionIds={selectedIds} />,
              });
            }}
            variant="destructive"
          >
            <Trash2 />
            {t("delete")}
            <Badge className="rounded-full w-5 h-5 text-xs">
              {table.getSelectedRowModel().rows.length}
            </Badge>
          </Button>
        </div>
      )}
    </>
  );
}
