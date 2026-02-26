"use client";

import type { Table } from "@tanstack/react-table";
import { useCallback } from "react";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import FlatBadge from "~/components/FlatBadge";
import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";

type TransactionAllProcedureOutput =
  RouterOutputs["transaction"]["list"]["data"][number];

export function TransactionDataTableAction({
  table,
}: {
  table: Table<TransactionAllProcedureOutput>;
}) {
  const t = useTranslations();
  const rows = table.getFilteredSelectedRowModel().rows;

  const canDeleteTransaction = useCheckPermission("transaction.delete");
  const { openModal } = useModal();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateTransactionMutation = useMutation(
    trpc.transaction.updateStatus.mutationOptions({
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries(trpc.transaction.pathFilter());
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        const { transactionIds } = variables;
        if (variables.status === "VALIDATED" && transactionIds) {
          const validatedRows = rows.filter((r) =>
            transactionIds.includes(r.original.id),
          );
          for (const row of validatedRows) {
            void fetch("/api/emails/transaction/validated", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transactionId: row.original.id,
                studentId: row.original.studentId,
              }),
            });
          }
        }
        table.toggleAllRowsSelected(false);
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
              <Button variant={"outline"}>
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
            <Badge className="h-5 w-5 rounded-full text-xs">
              {table.getSelectedRowModel().rows.length}
            </Badge>
          </Button>
        </div>
      )}
    </>
  );
}
