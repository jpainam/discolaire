"use client";

import { useParams } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { exportTableToCSV } from "@/lib/export";
import { AppRouter } from "@/server/api/root";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import {
  ChevronsUpDown,
  LayoutTemplate,
  TicketCheck,
  Trash2,
  X,
} from "lucide-react";

type TransactionAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["transaction"]["all"]>
>[number];

export function TransactionDataTableActions({
  table,
}: {
  table: Table<TransactionAllProcedureOutput>;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams() as { id: string };
  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="w-full justify-between"
              size={"sm"}
            >
              <div className="flex flex-row items-center gap-1">
                <LayoutTemplate className="h-4 w-4" />
                {t("actions")} (
                {table.getFilteredSelectedRowModel().rows.length})
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <TicketCheck className="mr-2 h-4 w-4" />
              {t("validate")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <X className="mr-2 h-4 w-4" />
              {t("cancel")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-destructive text-destructive-foreground">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        {t("export")}
      </Button>
    </div>
  );
}
