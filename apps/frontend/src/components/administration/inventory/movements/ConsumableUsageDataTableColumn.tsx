"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { Pencil, Trash2 } from "lucide-react";
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

import { CreateEditStockWithdrawal } from "~/components/administration/inventory/movements/CreateEditStockWithdrawal";
import FlatBadge from "~/components/FlatBadge";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { InventoryUsageDetail } from "../InventoryUsageDetail";

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<
  RouterOutputs["inventory"]["consumableUsages"][number],
  unknown
>[] {
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
        <DataTableColumnHeader column={column} title={t("date")} />
      ),
      size: 60,
      cell: ({ row }) => {
        const usage = row.original;
        return (
          <div className="text-muted-foreground">
            {usage.createdAt.toLocaleDateString(i18next.language, {
              weekday: "short",
              month: "short",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const usage = row.original;
        return <ItemCell item={usage} />;
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("quantity")} />
      ),
      cell: ({ row }) => {
        const usage = row.original;
        return (
          <div className="text-muted-foreground">
            {usage.quantity} {usage.consumable?.unit.name}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("type")} />
      ),
      cell: () => {
        return <FlatBadge variant={"pink"}>{t("IN")}</FlatBadge>;
      },
    },
    // {
    //   accessorKey: "note",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("description")} />
    //   ),
    //   cell: ({ row }) => {
    //     const inventory = row.original;
    //     return <div className="text-muted-foreground">{inventory.note}</div>;
    //   },
    // },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("to")} />
      ),
      cell: ({ row }) => {
        const usage = row.original;
        return (
          <Link
            href={`/users/${usage.userId}`}
            className="text-muted-foreground hover:underline"
          >
            {usage.user.name}
          </Link>
        );
      },
    },
    // {
    //   accessorKey: "createdBy.name",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t("created_by")} />
    //   ),
    //   cell: ({ row }) => {
    //     const consumable = row.original;
    //     return (
    //       <div className="text-muted-foreground">
    //         {consumable.createdBy.name}
    //       </div>
    //     );
    //   },
    // },

    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: function Cell({ row }) {
        return <ActionCell inventory={row.original} />;
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}

function ActionCell({
  inventory,
}: {
  inventory: RouterOutputs["inventory"]["consumableUsages"][number];
}) {
  const confirm = useConfirm();
  const { t } = useLocale();

  const canDeleteInventory = useCheckPermission(
    "inventory",
    PermissionAction.DELETE,
  );
  const canUpdateInventory = useCheckPermission(
    "inventory",
    PermissionAction.UPDATE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { openSheet } = useSheet();

  const deleteUsageMutation = useMutation(
    trpc.inventory.deleteUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.all.pathFilter());
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
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canUpdateInventory && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  title: t("Update asset"),
                  view: (
                    <CreateEditStockWithdrawal
                      id={inventory.id}
                      userId={inventory.userId}
                      consumableId={inventory.consumableId}
                      quantity={inventory.quantity}
                      note={inventory.note ?? ""}
                    />
                  ),
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteInventory && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteUsageMutation.mutate(inventory.id);
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

function ItemCell({
  item,
}: {
  item: RouterOutputs["inventory"]["consumableUsages"][number];
}) {
  const consumable = item.consumable;
  const { openSheet } = useSheet();

  if (!consumable) {
    return <div className="text-muted-foreground">-</div>;
  }

  return (
    <Button
      variant="link"
      onClick={() => {
        openSheet({
          view: <InventoryUsageDetail item={item} />,
        });
      }}
    >
      <span>{consumable.name}</span>
    </Button>
  );
}
