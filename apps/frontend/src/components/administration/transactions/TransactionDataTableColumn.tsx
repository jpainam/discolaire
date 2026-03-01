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
import { Banknote, BookCopy, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { TransactionType } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { TransactionStatus } from "~/components/students/transactions/StudentTransactionTable";
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
import { DeleteIcon, ViewIcon } from "~/icons";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { TransactionDetails } from "./TransactionDetails";

type TransactionAllProcedureOutput =
  RouterOutputs["transaction"]["list"]["data"][number];

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
          size: 100,
          cell: ({ row }) => {
            const transaction = row.original;
            return (
              <div className="text-muted-foreground">
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
                className="block min-w-0 truncate hover:underline"
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
          size: 120,
          cell: ({ row }) => {
            const transaction = row.original;
            return (
              <Link
                className="block truncate hover:underline"
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
            return <div className="truncate">{row.original.description}</div>;
          },
        }),
        columnHelper.accessor("transactionType", {
          id: "transactionType",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("type")} />
          ),
          size: 100,
          cell: ({ row }) => {
            const type = row.original.transactionType;
            if (type === TransactionType.DISCOUNT) {
              return (
                <Badge appearance="light" variant="info">
                  {t("discount")}
                </Badge>
              );
            }
            if (type === TransactionType.DEBIT) {
              return (
                <Badge appearance="light" variant="destructive">
                  {t("debit")}
                </Badge>
              );
            }
            return (
              <Badge appearance="light" variant="success">
                {t("credit")}
              </Badge>
            );
          },
        }),
        columnHelper.accessor("method", {
          id: "method",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("method")} />
          ),
          size: 100,
          cell: ({ row }) => {
            return (
              <Badge variant="secondary" size="xs">
                <Banknote className="h-3 w-3" />
                {row.original.method}
              </Badge>
            );
          },
        }),
        columnHelper.accessor((row) => row.journal?.name, {
          id: "journal",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("journal")} />
          ),
          size: 140,
          cell: ({ row }) => {
            const journal = row.original.journal;
            if (!journal)
              return <span className="text-muted-foreground">—</span>;
            return (
              <Badge variant="secondary" size="xs">
                {journal.name}
              </Badge>
            );
          },
        }),
        columnHelper.accessor("status", {
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("status")} />
          ),
          size: 120,
          cell: ({ row }) => {
            const status = row.original.status;
            return (
              <div className="flex items-center gap-1">
                <TransactionStatus status={status} />
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
              <div className="font-medium">
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
        columnHelper.accessor("observation", {
          id: "observation",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("observation")} />
          ),
          cell: ({ row }) => {
            return (
              <div className="text-muted-foreground line-clamp-1">
                {row.original.observation ?? "—"}
              </div>
            );
          },
        }),
        columnHelper.accessor((row) => row.createdBy?.username, {
          id: "createdBy",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("created_by")} />
          ),
          size: 120,
          cell: ({ row }) => {
            const user = row.original.createdBy;
            if (!user) return <span className="text-muted-foreground">—</span>;
            return (
              <Badge size="xs" variant="secondary">
                {user.username}
              </Badge>
            );
          },
        }),
        columnHelper.accessor((row) => row.updatedBy2?.username, {
          id: "updatedBy",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("updatedBy")} />
          ),
          size: 120,
          cell: ({ row }) => {
            const user = row.original.updatedBy2;
            if (!user) return <span className="text-muted-foreground">—</span>;
            return (
              <Badge size="xs" variant="secondary">
                {user.username}
              </Badge>
            );
          },
        }),
        columnHelper.accessor((row) => row.receivedBy?.username, {
          id: "receivedBy",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("receivedBy")} />
          ),
          size: 120,
          cell: ({ row }) => {
            const user = row.original.receivedBy;
            if (!user) return <span className="text-muted-foreground">—</span>;
            return (
              <Badge size="xs" variant="secondary">
                {user.username}
              </Badge>
            );
          },
        }),
        columnHelper.accessor("receivedAt", {
          id: "receivedAt",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("receivedAt")} />
          ),
          size: 100,
          cell: ({ row }) => {
            const date = row.original.receivedAt;
            if (!date) return <span className="text-muted-foreground">—</span>;
            return (
              <div className="text-muted-foreground">
                {date.toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
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
      onSuccess: async (_data, variables) => {
        await queryClient.invalidateQueries(trpc.transaction.pathFilter());
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        if (variables.status === "VALIDATED" && variables.transactionId) {
          void fetch("/api/emails/transaction/validated", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: variables.transactionId,
              studentId: transaction.studentId,
            }),
          });
        }
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canDeleteTransaction = useCheckPermission("transaction.delete");
  const canUpdateTransaction = useCheckPermission("transaction.update");

  const { openModal } = useModal();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon-sm"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              openModal({
                title: t("details"),
                className: "sm:max-w-lg",
                view: <TransactionDetails transactionId={transaction.id} />,
              });
            }}
          >
            <ViewIcon />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateTransaction && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <BookCopy className="text-muted-foreground h-4 w-4" />
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
                        className="text-muted-foreground size-4"
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
                        className="text-muted-foreground size-4"
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
                        className="text-muted-foreground size-4"
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
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
