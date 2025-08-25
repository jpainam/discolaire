import type { ColumnDef, Row } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { createColumnHelper } from "@tanstack/react-table";
import { decode } from "entities";
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

import { Badge } from "~/components/base-badge";
import { Pill, PillAvatar } from "~/components/pill";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
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
      size: 60,
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div>
            {transaction.createdAt.toLocaleDateString(i18next.language, {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
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
            className="hover:text-blue-600 hover:underline"
            href={`/students/${transaction.studentId}/transactions`}
          >
            {transaction.student.lastName}
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
            className="hover:text-blue-600 hover:underline"
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
        return <div className="line-clamp-1">{row.original.description}</div>;
      },
    }),
    columnHelper.accessor("deletedAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("deletedAt")} />
      ),
      size: 80,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Badge appearance={"outline"} variant={"destructive"}>
            <CrossCircledIcon
              className="size-4 text-red-500"
              aria-hidden="true"
            />
            {transaction.deletedAt?.toLocaleDateString(i18next.language, {
              year: "2-digit",
              month: "short",
              day: "2-digit",
            })}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("deletedById", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={""} />
      ),
      size: 80,
      cell: ({ row }) => {
        const transaction = row.original;
        const user = transaction.deletedBy;
        const name = user?.name ?? user?.username ?? "N/A";

        return (
          <Pill>
            <PillAvatar
              fallback={name.slice(0, 2).toUpperCase()}
              src={user?.avatar ?? undefined}
            />

            {decode(user?.name ?? user?.username ?? "")}
          </Pill>
        );
      },
    }),

    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("amount")} />
      ),
      size: 60,
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
    columnHelper.accessor("description", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Badge variant={"secondary"} className="line-clamp-1 truncate">
            {transaction.observation}
          </Badge>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
