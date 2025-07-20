"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { useState } from "react";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditAsset } from "./CreateEditAsset";
import { CreateEditConsumable } from "./CreateEditConsumable";

export function getColumns({
  t,
}: {
  t: TFunction<string, unknown>;
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
        const minLevelStock = inventory.other.minLevelStock;
        const unit = inventory.other.unitName;
        return (
          <div className="flex flex-row items-center gap-2">
            {currentStock && (
              <FlatBadge variant={"green"}>
                {t("Current stock")}: {currentStock} {unit}
              </FlatBadge>
            )}
            {minLevelStock && (
              <FlatBadge variant={"yellow"}>
                {t("Min level")}: {minLevelStock} {unit}
              </FlatBadge>
            )}
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
  const deleteConsumableMutation = useMutation(
    trpc.inventory.deleteConsumable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();

  const deleteAssetMutation = useMutation(
    trpc.inventory.deleteAsset.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  //const currentStock = inventory.other.currentStock;
  //const minLevelStock = inventory.other.minLevelStock;

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
                if (inventory.type === "ASSET") {
                  openModal({
                    title: t("Update asset"),
                    view: (
                      <CreateEditAsset
                        asset={{
                          id: inventory.id,
                          name: inventory.name,
                          note: inventory.note,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                          schoolId: inventory.schoolId,
                          serial: inventory.other.serial ?? "",
                          sku: inventory.other.sku ?? "",
                        }}
                      />
                    ),
                  });
                } else {
                  openSheet({
                    title: t("Update consumable"),
                    view: (
                      <CreateEditConsumable
                        consumable={{
                          id: inventory.id,
                          name: inventory.name,
                          note: inventory.note,
                          schoolId: inventory.schoolId,
                          schoolYearId: inventory.schoolYearId,
                          currentStock: inventory.other.currentStock
                            ? Number(inventory.other.currentStock)
                            : 0,
                          minStockLevel: inventory.other.minStockLevel
                            ? Number(inventory.other.minStockLevel)
                            : 0,
                          unitId: inventory.other.unitId ?? "",
                        }}
                      />
                    ),
                  });
                }
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
                    if (inventory.type === "ASSET") {
                      deleteAssetMutation.mutate(inventory.id);
                    } else {
                      deleteConsumableMutation.mutate(inventory.id);
                    }
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
