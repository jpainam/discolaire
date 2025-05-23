"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
export function InventoryStockUnitTable() {
  const trpc = useTRPC();
  const { data: units } = useSuspenseQuery(trpc.inventory.units.queryOptions());
  const queryClient = useQueryClient();
  const deleteStockUnitMutation = trpc.inventory.deleteUnit.mutationOptions({});
  const canDeleteStockUnit = useCheckPermission(
    "inventory",
    PermissionAction.DELETE
  );
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
