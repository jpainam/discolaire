"use client";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PencilIcon, PlusCircle, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { useLocale } from "../../../i18n/index";
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
  const canDeleteStockUnit = useCheckPermission(
    "inventory",
    PermissionAction.DELETE,
  );
  const canUpdateStockUnit = useCheckPermission(
    "inventory",
    PermissionAction.UPDATE,
  );
  const canCreateStockUnit = useCheckPermission(
    "inventory",
    PermissionAction.CREATE,
  );
  const confirm = useConfirm();
  const { t } = useLocale();
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
                      <PlusCircle className="w-3 h-3" />
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
                  <EmptyState className="my-8" />
                </TableCell>{" "}
              </TableRow>
            )}
            {units.map((unit, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>
                    {unit.consumables.reduce(
                      (sum, c) => sum + c.currentStock,
                      0,
                    )}{" "}
                    {unit.name}
                  </TableCell>
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
                              const isConfirmed = await confirm({
                                title: t("Are you sure?"),
                                description: t(
                                  "This action will delete the stock unit and all its consumables. This action cannot be undone.",
                                ),
                                confirmText: t("Delete"),
                              });
                              if (isConfirmed) {
                                toast.loading(t("Deleting..."), { id: 0 });
                                deleteStockUnitMutation.mutate(unit.id);
                              }
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
