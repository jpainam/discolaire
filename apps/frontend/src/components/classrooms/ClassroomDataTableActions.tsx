/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import type { Table } from "@tanstack/react-table";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine, RiFilter3Line } from "@remixicon/react";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type ClassroomProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

export function ClassroomDataTableActions({
  table,
}: {
  table: Table<ClassroomProcedureOutput>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();
  const { t } = useLocale();
  const canDeleteClassroom = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:details"
  );
  const classroomDeleteMutation = api.classroom.delete.useMutation({
    onSettled: () => utils.classroom.invalidate(),
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      toast.success("deleted_successfully", { id: 0 });
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

  // Extract complex expressions into separate variables
  const cycleColumn = table.getColumn("cycleId");
  const cycleFacetedValues = cycleColumn?.getFacetedUniqueValues();
  const cycleFilterValue = cycleColumn?.getFilterValue();

  // Update useMemo hooks with simplified dependencies
  const uniqueStatusValues = useMemo(() => {
    if (!cycleColumn) return [];
    const values = Array.from(cycleFacetedValues?.keys() ?? []);
    return values.sort();
  }, [cycleColumn, cycleFacetedValues]);

  const selectedStatuses = useMemo(() => {
    return (cycleFilterValue as string[]) ?? [];
  }, [cycleFilterValue]);

  const statusCounts = useMemo(() => {
    if (!cycleColumn) return new Map();
    return cycleFacetedValues ?? new Map();
  }, [cycleColumn, cycleFacetedValues]);

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteClassroom && (
        <Button
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-6 w-6 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirmed) {
              toast.loading("deleting", { id: 0 });
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
          <Button variant="outline">
            <RiFilter3Line
              className="size-5 -ms-1.5 text-muted-foreground/60"
              size={20}
              aria-hidden="true"
            />
            Filter
            {selectedStatuses.length > 0 && (
              <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                {selectedStatuses.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-36 p-3" align="end">
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase text-muted-foreground/60">
              Status
            </div>
            <div className="space-y-3">
              {uniqueStatusValues.map((value, i) => (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${i}-${i}`}
                    checked={selectedStatuses.includes(value)}
                    onCheckedChange={(_checked: boolean) => {
                      //handleStatusChange(checked, value)
                    }}
                  />
                  <Label
                    htmlFor={`${i}-${i}`}
                    className="flex grow justify-between gap-2 font-normal"
                  >
                    {value}{" "}
                    <span className="ms-2 text-xs text-muted-foreground">
                      {statusCounts.get(value)}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{t("pdf_export")}</DropdownMenuItem>
          <DropdownMenuItem>{t("xml_export")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
