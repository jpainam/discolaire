import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { AppRouter } from "@/server/api/root";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import i18next, { TFunction } from "i18next";
import { Eye, MoreHorizontal, TicketCheck, Trash2 } from "lucide-react";

import { TransactionDeleteModal } from "./TransactionDeleteModal";
import { TransactionDetails } from "./TransactionDetails";

type TransactionAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["transaction"]["all"]>
>[number];

const columnHelper = createColumnHelper<TransactionAllProcedureOutput>();

export const fetchTransactionColumns = ({
  t,

  moneyFormatter,
}: {
  t: TFunction<string, unknown>;
  moneyFormatter: Intl.NumberFormat;
}): ColumnDef<TransactionAllProcedureOutput, unknown>[] => {
  const dateFormatter = new Intl.DateTimeFormat(i18next.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        const d =
          row.original.createdAt &&
          dateFormatter.format(new Date(row.original.createdAt));
        return <div>{d}</div>;
      },
    }),
    columnHelper.accessor("account", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("account")} />
      ),
      cell: ({ row }) => <div>{row.original.account?.name}</div>,
    }),
    columnHelper.accessor("transactionRef", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("transactionRef")} />
      ),
      cell: ({ row }) => {
        return <div>{row.original.transactionRef}</div>;
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
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("amount")} />
      ),
      cell: ({ row }) => {
        const amount = row.original.amount;
        return <div>{amount && moneyFormatter.format(amount)}</div>;
      },
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status as string;
        return (
          <FlatBadge
            className="flex w-20 justify-center"
            variant={
              status == "VALIDATED"
                ? "green"
                : status == "CANCELLED"
                  ? "red"
                  : "yellow"
            }
          >
            {t(status.toLowerCase())}
          </FlatBadge>
        );
      },
    }),
    {
      id: "actions",
      cell: ({ row }: { row: Row<TransactionAllProcedureOutput> }) => (
        <ActionCell transaction={row.original} />
      ),
    },
  ] as ColumnDef<TransactionAllProcedureOutput, unknown>[];
};

function ActionCell({
  transaction,
}: {
  transaction: TransactionAllProcedureOutput;
}) {
  const { t } = useLocale();
  const queryClient = useQueryClient();

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
              className: "p-4 w-[600px]",
              view: <TransactionDetails transactionId={transaction.id} />,
            });
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("details")}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={transaction.status == "VALIDATED"}
          onSelect={() => {
            // toast.promise(validateTransaction(transaction.id), {
            //   loading: t("validating"),
            //   success: () => {
            //     queryClient.invalidateQueries({ queryKey: ["transactions"] });
            //     return t("validated_successfully");
            //   },
            //   error: (error) => {
            //     return getErrorMessage(error);
            //   },
            // });
          }}
        >
          <TicketCheck className="mr-2 h-4 w-4" />
          {t("validate")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            openModal({
              title: t("delete"),
              className: "sm:px-8 p-4 w-[600px]",
              view: <TransactionDeleteModal transaction={transaction} />,
            });
          }}
          className="bg-destructive text-destructive-foreground"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
