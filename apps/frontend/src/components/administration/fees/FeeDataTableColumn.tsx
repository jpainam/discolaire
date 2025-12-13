"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import type { Fee } from "@repo/db/client";

import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { CURRENCY } from "~/lib/constants";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type FeeProcedureOutput = NonNullable<RouterOutputs["fee"]["all"]>[number];

export function useFeesColumns(): ColumnDef<FeeProcedureOutput, unknown>[] {
  const locale = useLocale();
  const t = useTranslations();

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
            {fee.amount.toLocaleString(locale)} {CURRENCY}
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
        const d = fee.dueDate.toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
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
  const t = useTranslations();
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
