/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import type { Table } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine, RiFilter3Line } from "@remixicon/react";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

type ClassroomProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

export function ClassroomDataTableAction({
  table,
}: {
  table: Table<ClassroomProcedureOutput>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const canDeleteClassroom = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  const classroomDeleteMutation = api.classroom.delete.useMutation({
    onSettled: () => utils.classroom.invalidate(),
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      toast.success("deleted_successfully", { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

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

  const cycleQuery = api.classroomCycle.all.useQuery();
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
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              // icon: <Trash2 className="text-destructive" />,
              // alertDialogTitle: {
              //   className: "flex items-center gap-2",
              // },
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              const selectedIds = rows.map((row) => row.original.id);
              classroomDeleteMutation.mutate(selectedIds);
            }
          }}
          variant="destructive"
        >
          <RiDeleteBinLine
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("delete")}
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"sm"} variant="outline">
            <RiFilter3Line
              className="size-5 -ms-1.5 text-muted-foreground/60"
              size={20}
              aria-hidden="true"
            />
            {t("filter")}
            {selectedStatuses.size > 0 && (
              <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                {selectedStatuses.size}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-36 p-3" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase text-muted-foreground/60">
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
                      <span className="ms-2 text-xs text-muted-foreground">
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
