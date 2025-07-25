"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import i18next from "i18next";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import FlatBadge from "~/components/FlatBadge";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

type RequiredTransactionOutput =
  RouterOutputs["transaction"]["required"][number];

export function getRequiredColumns({
  t,
  currency,
}: {
  t: TFunction<string, unknown>;
  currency: string;
}): ColumnDef<RequiredTransactionOutput, unknown>[] {
  return [
    {
      id: "select",
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
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="text-muted-foreground text-sm">
            {transaction.createdAt.toLocaleDateString(i18next.language, {
              year: "2-digit",
              month: "short",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "student",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fullName")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <Link
            className="hover:text-blue-600 hover:underline"
            href={`/students/${transaction.student.id}/transactions`}
          >
            {transaction.student.lastName}
          </Link>
        );
      },
    },
    {
      accessorKey: "classroom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("classroom")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="text-muted-foreground">
            {transaction.fee.classroom.reportName}
          </div>
        );
      },
    },

    {
      accessorKey: "fee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("fees")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="text-muted-foreground">
            {transaction.fee.description}
          </div>
        );
      },
    },
    {
      accessorKey: "fee.amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("amount")} />
      ),
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div>
            {transaction.fee.amount.toLocaleString(i18next.language, {
              style: "currency",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
              currency: currency,
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("status")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const transaction = row.original;
        const status = transaction.status;

        return (
          <FlatBadge
            variant={
              status == "PENDING"
                ? "yellow"
                : status == "VALIDATED"
                  ? "green"
                  : "red"
            }
            className="text-xs capitalize"
          >
            {t(transaction.status)}
          </FlatBadge>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCells transaction={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCells({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transaction,
}: {
  transaction: RequiredTransactionOutput;
}) {
  //const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  //const router = useRouter();

  const canDeleteClassroom = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  // const canUpdateClassroom = useCheckPermission(
  //   "classroom",
  //   PermissionAction.UPDATE
  // );
  // const deleteClassroomMutation = caller.classroom.delete.useMutation({
  //   onSettled: () => utils.classroom.invalidate(),
  //   onSuccess: () => {
  //     toast.success(t("deleted_successfully"), { id: 0 });
  //   },
  //   onError: (error) => {
  //     toast.error(error.message, { id: 0 });
  //   },
  // });

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              //router.push(routes.classrooms.details(classroom.id));
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>

          {canDeleteClassroom && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!canDeleteClassroom}
                variant="destructive"
                className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    //deleteClassroomMutation.mutate(classroom.id);
                  }
                }}
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
