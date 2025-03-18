import type { ColumnDef, Row } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import { Eye, MoreHorizontal } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CrossCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import FlatBadge from "~/components/FlatBadge";
import { TransactionDetails } from "./TransactionDetails";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["getDeleted"]
>[number];

const columnHelper = createColumnHelper<TransactionAllProcedureOutput>();

export const getDeletedDataTableColumn = ({
  t,
  currency,
}: {
  t: TFunction<string, unknown>;
  currency: string;
}): ColumnDef<TransactionAllProcedureOutput, unknown>[] => {
  return [
    columnHelper.accessor("id", {
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div>
            {transaction.createdAt.toLocaleDateString(i18next.language, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("account", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("account")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Link
            className="hover:underline hover:text-blue-600"
            href={`/students/${transaction.account.studentId}/transactions`}
          >
            {transaction.account.name}
          </Link>
        );
      },
    }),
    columnHelper.accessor("transactionRef", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("transactionRef")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Link
            className="hover:underline hover:text-blue-600"
            href={`/students/${transaction.account.studentId}/transactions/${transaction.id}`}
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
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <FlatBadge className="gap-2" variant={"red"}>
            <CrossCircledIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="capitalize">{t("deleted")}</span>
          </FlatBadge>
        );
      },
    }),
    columnHelper.accessor("deletedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("deletedAt")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div>
            {transaction.deletedAt?.toLocaleDateString(i18next.language, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("amount")} />
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <div>
            {amount.toLocaleString(i18next.language, {
              style: "currency",
              currency: currency,
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
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ] as ColumnDef<TransactionAllProcedureOutput, unknown>[];
};

function ActionCell({
  transaction,
}: {
  transaction: TransactionAllProcedureOutput;
}) {
  const { t } = useLocale();

  const { openModal } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
