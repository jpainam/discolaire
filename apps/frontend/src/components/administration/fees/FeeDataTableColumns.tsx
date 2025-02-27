"use client";

import type { Fee } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import i18next from "i18next";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Separator } from "@repo/ui/components/separator";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import { CURRENCY } from "~/lib/constants";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>[number];

export function fetchFeesColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<FeeProcedureOutput, unknown>[] {
  const dateFormat = Intl.DateTimeFormat(i18next.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },

    // {
    //   accessorKey: "code",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Code" />
    //   ),
    //   cell: ({ row }) => {
    //     const fee = row.original;
    //     return <div>{fee.code}</div>;
    //   },
    //   filterFn: (row, id, value) => {
    //     return value instanceof Array && value.includes(row.getValue(id));
    //   },
    // },

    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Montant" />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        return (
          <div>
            {fee.amount.toLocaleString(i18next.language)} {CURRENCY}
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("applied")} />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        const hasPassed = new Date(fee.dueDate) < new Date();

        return (
          <FlatBadge variant={hasPassed ? "green" : "red"}>
            {hasPassed ? t("yes") : t("no")}
          </FlatBadge>
        );
      },
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("date")} />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        const d = dateFormat.format(fee.dueDate);
        return <div>{d}</div>;
      },
    },
    {
      accessorKey: "classroom",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("classroom")} />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        const c = fee.classroom;
        return <div>{c.name}</div>;
      },
    },
    {
      accessorKey: "isRequired",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("required_fees")} />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        return (
          <FlatBadge variant={fee.isRequired ? "red" : "green"}>
            {fee.isRequired ? t("yes") : t("no")}
          </FlatBadge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell fee={row.original} />,
    },
  ];
}

function ActionCell({ fee }: { fee: Fee }) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const feeMutation = api.fee.delete.useMutation();
  const utils = api.useUtils();
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              openModal({
                title: t("edit"),
                view: <CreateEditFee fee={fee} />,
              });
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            disabled={feeMutation.isPending}
            onSelect={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                confirmText: t("delete"),
                cancelText: t("cancel"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                toast.promise(feeMutation.mutateAsync(fee.id), {
                  loading: t("deleting"),
                  error: (error) => {
                    return getErrorMessage(error);
                  },
                  success: () => {
                    void utils.fee.all.invalidate();
                    return t("delete_successfully");
                  },
                });
              }
            }}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
          >
            <Trash2 />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
