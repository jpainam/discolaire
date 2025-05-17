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

import { Badge } from "@repo/ui/components/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
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
            className="hover:text-blue-600 line-clamp-1 hover:underline"
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
        <DataTableColumnHeader column={column} title={t("note")} />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        return <div>{inventory.note}</div>;
      },
    },
    {
      accessorKey: "other",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="" />
      ),
      cell: ({ row }) => {
        const inventory = row.original;
        if (inventory.type === "ASSET") {
          const sku = inventory.other.sku;
          const serial = inventory.other.serial;
          return (
            <div className="flex flex-row items-center gap-2">
              {sku && (
                <Badge>
                  {t("Sku")}: {sku}
                </Badge>
              )}
              {serial && (
                <Badge variant={"destructive"}>
                  {t("Serial number")}: {serial}
                </Badge>
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
              <Badge>
                {t("Current stock")}: {currentStock} {unit}
              </Badge>
            )}
            {minLevelStock && (
              <Badge variant={"destructive"}>
                {t("Min level")}: {minLevelStock} {unit}
              </Badge>
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
  const deleteConsumableMutation = useMutation(
    trpc.inventory.deleteConsumable.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
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
                          schoolYearId: inventory.schoolYearId,
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
