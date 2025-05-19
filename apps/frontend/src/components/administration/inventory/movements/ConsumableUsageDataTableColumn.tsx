"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18next from "i18next";
import { CreateEditConsumableUsage } from "~/app/(dashboard)/administration/inventory/CreateEditConsumableUsage";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

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
      size: 10,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      size: 40,
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
        const inventory = row.original;
        return (
          <Link
            className="hover:text-blue-600 line-clamp-1 hover:underline"
            href={`/administration/inventory/${inventory.id}`}
          >
            {inventory.consumable?.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "note",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        return <div className="text-muted-foreground">{inventory.note}</div>;
      },
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        return (
          <div className="text-muted-foreground">{inventory.user?.name}</div>
        );
      },
    },
    {
      accessorKey: "createdBy.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user")} />
      ),
      cell: ({ row }) => {
        const consumable = row.original;
        return (
          <div className="text-muted-foreground">
            {consumable.createdBy?.name}
          </div>
        );
      },
    },

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
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const router = useRouter();

  const canDeleteInventory = useCheckPermission(
    "inventory",
    PermissionAction.DELETE
  );
  const canUpdateInventory = useCheckPermission(
    "inventory",
    PermissionAction.UPDATE
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { openModal } = useModal();

  const deleteUsageMutation = useMutation(
    trpc.inventory.deleteUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  return (
    <div className="flex justify-end">
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/administration/inventory/${inventory.id}`);
            }}
          >
            <Eye />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateInventory && (
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("Update asset"),
                  view: (
                    <CreateEditConsumableUsage
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
