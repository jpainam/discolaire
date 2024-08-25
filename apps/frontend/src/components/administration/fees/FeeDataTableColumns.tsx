"use client";

import { Fee } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import i18next, { TFunction } from "i18next";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useAlert } from "@repo/lib/hooks/use-alert";
import { useModal } from "@repo/lib/hooks/use-modal";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DataTableColumnHeader } from "@repo/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";

import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import { CURRENCY } from "~/lib/constants";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { Classroom } from "~/types/classroom";

type FeeProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["fee"]["all"]>
>[number];

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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
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
        const hasPassed = fee.dueDate
          ? new Date(fee.dueDate) < new Date()
          : false;
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
        const d = fee.dueDate ? dateFormat.format(fee.dueDate) : "";
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
        const c = fee.classroom as Classroom;
        return <div>{c?.shortName}</div>;
      },
    },
    {
      accessorKey: "journal.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("journal")} />
      ),
      cell: ({ row }) => {
        const fee = row.original;
        return <div>{fee.journal?.name || "N/A"}</div>;
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
  const { openAlert } = useAlert();
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
            onSelect={() => {
              openAlert({
                title: t("delete"),
                description: t("delete_confirmation"),
                onConfirm: () => {
                  toast.promise(feeMutation.mutateAsync({ id: fee.id }), {
                    loading: t("deleting"),
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                    success: () => {
                      utils.fee.all.invalidate();
                      return t("delete_successfully");
                    },
                  });
                },
              });
            }}
            className="bg-destructive text-destructive-foreground"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
