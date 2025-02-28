import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import { BookCopy, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { TransactionStatus } from "~/components/students/transactions/TransactionTable";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { TransactionDetails } from "./TransactionDetails";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["all"]
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
        const d = dateFormatter.format(new Date(row.original.createdAt));
        return <div>{d}</div>;
      },
    }),
    columnHelper.accessor("account", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("account")} />
      ),
      cell: ({ row }) => <div>{row.original.account.name}</div>,
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
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return <TransactionStatus status={status} />;
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
  const utils = api.useUtils();
  const updateTransactionMutation = api.transaction.updateStatus.useMutation({
    onSettled: async () => {
      await utils.transaction.invalidate();
      await utils.student.transactions.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });

  const canDeleteTransaction = useCheckPermissions(
    PermissionAction.DELETE,
    "transaction"
  );

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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <BookCopy className="mr-2 h-4 w-4" />
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
              <DropdownMenuRadioItem value={"VALIDATED"} className="capitalize">
                <FlatBadge variant={"green"}>
                  <CheckCircledIcon
                    className="mr-2 size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {t("validate")}
                </FlatBadge>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"CANCELED"} className="capitalize">
                <FlatBadge variant={"red"}>
                  <CrossCircledIcon
                    className="mr-2 size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {t("cancel")}
                </FlatBadge>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"PENDING"} className="capitalize">
                <FlatBadge variant={"yellow"}>
                  <StopwatchIcon
                    className="mr-2 size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {t("pending")}
                </FlatBadge>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {canDeleteTransaction && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  title: t("delete"),
                  className: "w-[400px]",
                  view: <DeleteTransaction transactionId={transaction.id} />,
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
  );
}
