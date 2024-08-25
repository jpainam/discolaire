import Link from "next/link";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
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
} from "@repo/ui/dropdown-menu";
import FlatBadge, { FlatBadgeVariant } from "@repo/ui/FlatBadge";
import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import i18next, { TFunction } from "i18next";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/hooks/use-locale";
import { useRouter } from "~/hooks/use-router";
import { CURRENCY } from "~/lib/constants";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type StudentTransactionProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["student"]["transactions"]>
>[number];

export function fetchTransactionColumns({
  t,
  dateFormatter,
  studentId,
}: {
  t: TFunction<string, unknown>;
  studentId: string;
  dateFormatter: Intl.DateTimeFormat;
}): ColumnDef<StudentTransactionProcedureOutput, unknown>[] {
  return [
    {
      id: "select",
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "transactionRef",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("transactionRef")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "transactionType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("transactionType")} />
      ),
      cell: (info) => info.getValue(),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        const d = dateFormatter.format(new Date(row.getValue("createdAt")));
        return <div>{d}</div>;
      },
    },

    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={routes.students.transactions.details(
              studentId,
              transaction.id,
            )}
          >
            {transaction.description}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("amount")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div>
            {transaction.amount?.toLocaleString(i18next.language, {
              style: "currency",
              currency: CURRENCY,
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </div>
        );
      },
      enableSorting: true,
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return transaction.status ? (
          <TransactionStatus status={transaction.status} />
        ) : (
          <></>
        );
      },
    },
    {
      id: "action",

      cell: ({ row }) => {
        return <ActionsCell transaction={row.original} />;
      },
    },
  ] as ColumnDef<StudentTransactionProcedureOutput, unknown>[];
}

function TransactionStatus({ status }: { status: string }) {
  const { t } = useLocale();
  let variant = "";
  if (status === "VALIDATED") {
    variant = "green";
  } else if (status === "CANCELLED") {
    variant = "pink";
  } else if (status === "IN_PROGRESS") {
    variant = "yellow";
  }

  return (
    <FlatBadge className="gap-2" variant={variant as FlatBadgeVariant}>
      {status === "CANCELLED" ? (
        <CrossCircledIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      ) : status === "VALIDATED" ? (
        <CheckCircledIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <StopwatchIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <span className="capitalize">{t(status)}</span>
    </FlatBadge>
  );
}

function ActionsCell({
  transaction,
}: {
  transaction: StudentTransactionProcedureOutput;
}) {
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const { t } = useLocale();
  const deleteTransactionsMutation = api.transaction.delete.useMutation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t("status")}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={transaction.status ?? ""}
              onValueChange={(value) => {
                toast.promise(
                  deleteTransactionsMutation.mutateAsync({
                    ids: [transaction.id],
                  }),
                  {
                    loading: t("deleting"),
                    success: "Label updated",
                    error: (err) => getErrorMessage(err),
                  },
                );
              }}
            >
              <DropdownMenuRadioItem value={"VALIDATED"} className="capitalize">
                <FlatBadge variant={"green"}>{t("validate")}</FlatBadge>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"CANCELLED"} className="capitalize">
                <FlatBadge variant={"yellow"}>{t("cancel")}</FlatBadge>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value={"IN_PROGRESS"}
                className="capitalize"
              >
                {t("in_progress")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-destructive text-destructive-foreground"
          onSelect={() => {}}
        >
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
