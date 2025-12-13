import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { decode } from "entities";
import { BookCopy, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { Badge } from "~/components/base-badge";
import FlatBadge from "~/components/FlatBadge";
import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { TransactionStatus } from "~/components/students/transactions/TransactionTable";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CURRENCY } from "~/lib/constants";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { TransactionDetails } from "./TransactionDetails";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["all"]
>[number];

const columnHelper = createColumnHelper<TransactionAllProcedureOutput>();

export const useTransactionColumns = (): ColumnDef<
  TransactionAllProcedureOutput,
  unknown
>[] => {
  const t = useTranslations();
  const locale = useLocale();
  return useMemo(
    () =>
      [
        columnHelper.accessor("id", {
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          size: 28,
          enableSorting: false,
          enableHiding: false,
        }),
        columnHelper.accessor("createdAt", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("createdAt")} />
          ),
          size: 80,
          cell: ({ row }) => {
            const transaction = row.original;

            return (
              <div>
                {transaction.createdAt.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            );
          },
        }),
        columnHelper.accessor("student", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("student")} />
          ),
          cell: ({ row }) => {
            const transaction = row.original;
            return (
              <Link
                className="hover:underline"
                href={`/students/${transaction.studentId}/transactions`}
              >
                {decode(
                  transaction.student.lastName ??
                    transaction.student.firstName ??
                    "",
                )}
              </Link>
            );
          },
        }),
        columnHelper.accessor("transactionRef", {
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("transactionRef")}
            />
          ),
          cell: ({ row }) => {
            const transaction = row.original;
            return (
              <Link
                className="hover:underline"
                href={`/students/${transaction.studentId}/transactions/${transaction.id}`}
              >
                {transaction.transactionRef}
              </Link>
            );
          },
        }),
        columnHelper.accessor("description", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("description")} />
          ),
          cell: ({ row }) => {
            return <div>{row.original.description}</div>;
          },
        }),
        columnHelper.accessor("status", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("status")} />
          ),
          size: 120,
          cell: ({ row }) => {
            const trans = row.original;
            const status = row.original.status;
            const user = trans.updatedBy2;
            return (
              <div className="flex flex-row gap-1">
                <TransactionStatus status={status} />
                {user && (
                  <Badge className="w-fit" variant={"secondary"}>
                    {user.username}
                  </Badge>
                )}
              </div>
            );
          },
        }),
        columnHelper.accessor("amount", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("amount")} />
          ),
          size: 100,
          cell: ({ row }) => {
            const amount = row.original.amount;
            return (
              <div>
                {amount.toLocaleString(locale, {
                  style: "currency",
                  currency: CURRENCY,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            );
          },
        }),

        {
          id: "actions",
          cell: ({ row }: { row: Row<TransactionAllProcedureOutput> }) => (
            <ActionCell transaction={row.original} />
          ),
          size: 28,
          enableSorting: false,
          enableHiding: false,
        },
      ] as ColumnDef<TransactionAllProcedureOutput, unknown>[],
    [locale, t],
  );
};

function ActionCell({
  transaction,
}: {
  transaction: TransactionAllProcedureOutput;
}) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

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

  const canDeleteTransaction = useCheckPermission(
    "transaction",
    PermissionAction.DELETE,
  );
  const canUpdateTransaction = useCheckPermission(
    "transaction",
    PermissionAction.UPDATE,
  );

  const { openModal } = useModal();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className="size-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              openModal({
                title: t("details"),
                view: <TransactionDetails transactionId={transaction.id} />,
              });
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateTransaction && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BookCopy className="text-muted-foreground mr-2 h-4 w-4" />
                {t("status")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={transaction.status}
                  onValueChange={(value) => {
                    if (["PENDING", "CANCELED", "VALIDATED"].includes(value)) {
                      const v = value as "PENDING" | "CANCELED" | "VALIDATED";
                      toast.loading(t("updating"), { id: 0 });
                      updateTransactionMutation.mutate({
                        transactionId: transaction.id,
                        status: v,
                      });
                    } else {
                      toast.error(t("invalid_status"), { id: 0 });
                    }
                  }}
                >
                  <DropdownMenuRadioItem
                    value={"VALIDATED"}
                    className="capitalize"
                  >
                    <FlatBadge variant={"green"}>
                      <CheckCircledIcon
                        className="text-muted-foreground mr-2 size-4"
                        aria-hidden="true"
                      />
                      {t("validate")}
                    </FlatBadge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={"CANCELED"}
                    className="capitalize"
                  >
                    <FlatBadge variant={"red"}>
                      <CrossCircledIcon
                        className="text-muted-foreground mr-2 size-4"
                        aria-hidden="true"
                      />
                      {t("cancel")}
                    </FlatBadge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value={"PENDING"}
                    className="capitalize"
                  >
                    <FlatBadge variant={"yellow"}>
                      <StopwatchIcon
                        className="text-muted-foreground mr-2 size-4"
                        aria-hidden="true"
                      />
                      {t("pending")}
                    </FlatBadge>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          {canDeleteTransaction && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  openModal({
                    title: t("delete"),
                    view: (
                      <DeleteTransaction transactionIds={[transaction.id]} />
                    ),
                  });
                }}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
