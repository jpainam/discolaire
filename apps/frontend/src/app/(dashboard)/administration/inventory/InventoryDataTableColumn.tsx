"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Undo2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditAssetUsage } from "~/components/administration/inventory/CreateEditAssetUsage";
import { CreateEditInventoryItem } from "./CreateEditInventoryItem";

export function getColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
}): ColumnDef<RouterOutputs["inventory"]["all"][number], unknown>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        return (
          <Link
            className="line-clamp-1 hover:text-blue-600 hover:underline"
            href={`/administration/inventory/${inventory.id}`}
          >
            {inventory.name}
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
        return <div>{inventory.note}</div>;
      },
    },
    {
      accessorKey: "users",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("users")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        return <AvatarGroup4 users={inventory.users} />;
      },
    },
    {
      accessorKey: "other",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("observation")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        if (inventory.type === "ASSET") {
          const sku = inventory.other.sku;
          const serial = inventory.other.serial;
          return (
            <div className="flex flex-row items-center gap-2">
              {sku && (
                <FlatBadge variant={"blue"}>
                  {t("Sku")}: {sku}
                </FlatBadge>
              )}
              {serial && (
                <FlatBadge variant={"red"}>
                  {t("Serial number")}: {serial}
                </FlatBadge>
              )}
            </div>
          );
        }
        const currentStock = inventory.other.currentStock;
        const minStockLevel = inventory.other.minStockLevel;
        const unit = inventory.other.unitName;
        return (
          <div className="flex flex-row items-center gap-2">
            <FlatBadge variant={"green"}>
              {t("Current stock")}: {currentStock} {unit}
            </FlatBadge>
            <FlatBadge variant={"yellow"}>
              {t("Min level")}: {minStockLevel} {unit}
            </FlatBadge>
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
  inventory: RouterOutputs["inventory"]["all"][number];
}) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();

  const t = useTranslations();

  const canDeleteInventory = useCheckPermission("inventory.delete");
  const canUpdateInventory = useCheckPermission("inventory.update");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteItemMutation = useMutation(
    trpc.inventory.deleteItem.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const returnAssetUsageMutation = useMutation(
    trpc.inventory.returnAssetUsage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const assetOther = inventory.type === "ASSET" ? inventory.other : null;
  const activeUsageId = assetOther?.activeUsageId ?? null;
  const activeUserName = assetOther?.activeUserName ?? null;
  const isAssetAssigned = Boolean(activeUsageId && activeUserName);

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
                  title: "Update item",
                  view: (
                    <CreateEditInventoryItem
                      item={{
                        id: inventory.id,
                        name: inventory.name,
                        note: inventory.note,
                        type: inventory.type,
                        other: inventory.other,
                      }}
                    />
                  ),
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canUpdateInventory && inventory.type === "ASSET" && !isAssetAssigned && (
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  title: "Assign asset",
                  view: (
                    <CreateEditAssetUsage
                      assetId={inventory.id}
                      dueAt={assetOther?.defaultReturnDate ?? ""}
                    />
                  ),
                });
              }}
            >
              <UserPlus />
              {"Assign asset"}
            </DropdownMenuItem>
          )}
          {canUpdateInventory && inventory.type === "ASSET" && isAssetAssigned && (
            <DropdownMenuItem
              onSelect={async () => {
                await confirm({
                  title: "Mark as returned",
                  description: activeUserName
                    ? `Return this asset from ${activeUserName}?`
                    : "Return this asset?",
                  onConfirm: async () => {
                    if (!activeUsageId) {
                      return;
                    }
                    await returnAssetUsageMutation.mutateAsync({
                      id: activeUsageId,
                    });
                  },
                });
              }}
            >
              <Undo2 />
              {"Mark as returned"}
            </DropdownMenuItem>
          )}
          {canDeleteInventory && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={async () => {
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),

                    onConfirm: async () => {
                      await deleteItemMutation.mutateAsync(inventory.id);
                    },
                  });
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

export function AvatarGroup4({
  users,
}: {
  users: { name: string; image?: string }[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  //https://mynaui.com/components/avatar-groups
  return (
    <div className="*:ring-background flex -space-x-2 *:ring-3">
      {users.map((user, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Avatar
              className={`transition-transform ${
                activeIndex === index ? "z-10 scale-110" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{user.name}</p>
            {/* <p className="text-sm">{user.role}</p> */}
          </TooltipContent>
        </Tooltip>
      ))}
      {users.length > 4 && (
        <Avatar className="text-muted-foreground z-10 text-sm font-medium">
          <AvatarFallback>+{users.length - 4}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
