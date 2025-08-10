"use client";

import type { Fee } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

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
      id: "actions",
      cell: ({ row }) => <ActionCell fee={row.original} />,
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCell({ fee }: { fee: Fee }) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const feeMutation = useMutation(
    trpc.fee.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
                view: <CreateEditFee classroomId={fee.classroomId} fee={fee} />,
              });
            }}
          >
            <Pencil />
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
                toast.loading(t("deleting"), { id: 0 });
                feeMutation.mutate(fee.id);
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
