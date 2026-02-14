"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PencilIcon, PlusCircle, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditStockUnit } from "./CreateEditStockUnit";

export function InventoryStockUnitTable() {
  const trpc = useTRPC();
  const { data: units } = useSuspenseQuery(trpc.inventory.units.queryOptions());
  const queryClient = useQueryClient();
  const deleteStockUnitMutation = useMutation(
    trpc.inventory.deleteUnit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.inventory.pathFilter());
        toast.success("Success", { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canDeleteStockUnit = useCheckPermission("inventory.delete");
  const canUpdateStockUnit = useCheckPermission("inventory.update");
  const canCreateStockUnit = useCheckPermission("inventory.create");
  const confirm = useConfirm();

  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("Count")}</TableHead>
              {(canUpdateStockUnit ||
                canDeleteStockUnit ||
                canCreateStockUnit) && (
                <TableHead className="text-right">
                  {canCreateStockUnit && (
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="size-8"
                      onClick={() => {
                        openModal({
                          title: t("Create a stock unit"),
                          view: <CreateEditStockUnit />,
                        });
                      }}
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  )}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyComponent />
                </TableCell>{" "}
              </TableRow>
            )}
            {units.map((unit, index) => {
              const count =
                (unit as { items?: unknown[] }).items?.length ??
                (unit as { consumables?: unknown[] }).consumables?.length ??
                0;
              return (
                <TableRow key={index}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{count}</TableCell>
                  {(canDeleteStockUnit || canUpdateStockUnit) && (
                    <TableCell className="text-right">
                      <div className="flex flex-row items-center justify-end gap-1">
                        {canUpdateStockUnit && (
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              openModal({
                                title: t("Update a stock unit"),
                                view: (
                                  <CreateEditStockUnit
                                    id={unit.id}
                                    name={unit.name}
                                  />
                                ),
                              });
                            }}
                            size={"icon"}
                            className="size-8"
                          >
                            <PencilIcon />
                          </Button>
                        )}
                        {canDeleteStockUnit && (
                          <Button
                            variant={"ghost"}
                            onClick={async () => {
                              await confirm({
                                title: t("Are you sure?"),
                                description: t(
                                  "This action will delete the stock unit. This action cannot be undone.",
                                ),
                                confirmText: t("Delete"),

                                onConfirm: async () => {
                                  toast.loading(t("Deleting..."), { id: 0 });
                                  await deleteStockUnitMutation.mutateAsync(
                                    unit.id,
                                  );
                                },
                              });
                            }}
                            size={"icon"}
                            className="size-8"
                          >
                            <TrashIcon className="text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
