/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

"use client";

import type { Table } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { RiDeleteBinLine, RiFilter3Line } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type ClassroomProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

export function ClassroomDataTableAction({
  table,
}: {
  table: Table<ClassroomProcedureOutput>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const t = useTranslations();
  const canDeleteClassroom = useCheckPermission("classroom.delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const classroomDeleteMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  // Clear selection on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  const confirm = useConfirm();

  const cycleQuery = useQuery(trpc.classroomCycle.all.queryOptions());
  const cycles = cycleQuery.data ?? [];

  // Extract complex expressions into separate variables
  const cycleColumn = table.getColumn("cycleId");
  const cycleFacetedValues = cycleColumn?.getFacetedUniqueValues();
  const cycleFilterValue = cycleColumn?.getFilterValue();

  // Update useMemo hooks with simplified dependencies
  const uniqueStatusValues = useMemo(() => {
    if (!cycleColumn) return [];
    const values = Array.from(cycleFacetedValues?.keys() ?? []);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return values.sort();
  }, [cycleColumn, cycleFacetedValues]);

  const selectedStatuses = useMemo(() => {
    return new Set((cycleFilterValue as string[]) ?? []);
  }, [cycleFilterValue]);

  const statusCounts = useMemo(() => {
    if (!cycleColumn) return new Map();
    return cycleFacetedValues ?? new Map();
  }, [cycleColumn, cycleFacetedValues]);

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteClassroom && (
        <Button
          size={"sm"}
          onClick={async () => {
            await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              // icon: <Trash2 className="text-destructive" />,
              // alertDialogTitle: {
              //   className: "flex items-center gap-2",
              // },

              onConfirm: async () => {
                const selectedIds = rows.map((row) => row.original.id);
                await classroomDeleteMutation.mutateAsync(selectedIds);
              },
            });
          }}
          variant="destructive"
        >
          <RiDeleteBinLine
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("delete")}
          <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <RiFilter3Line
              className="text-muted-foreground/60 -ms-1.5 size-5"
              size={20}
              aria-hidden="true"
            />
            {t("filter")}
            {selectedStatuses.size > 0 && (
              <span className="border-border bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {selectedStatuses.size}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-36 p-3" align="end">
          <div className="space-y-3">
            <div className="text-muted-foreground/60 text-xs font-medium uppercase">
              {t("cycle")}
            </div>
            <div className="space-y-3">
              {uniqueStatusValues.map((value, i) => {
                const label = cycles.find((cycle) => cycle.id === value)?.name;
                if (!label) return null;
                return (
                  <div key={value} className="flex items-center gap-2">
                    <Checkbox
                      id={`${i}-${i}`}
                      checked={selectedStatuses.has(value)}
                      onCheckedChange={(_checked: boolean) => {
                        const isSelected = selectedStatuses.has(value);
                        if (isSelected) {
                          selectedStatuses.delete(value);
                        } else {
                          selectedStatuses.add(value);
                        }
                        const filterValues = Array.from(selectedStatuses);
                        cycleColumn?.setFilterValue(
                          filterValues.length ? filterValues : undefined,
                        );
                        //handleStatusChange(checked, value)
                      }}
                    />
                    <Label
                      htmlFor={`${i}-${i}`}
                      className="flex grow justify-between gap-2 font-normal"
                    >
                      {label}{" "}
                      <span className="text-muted-foreground ms-2 text-xs">
                        {statusCounts.get(value)}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
