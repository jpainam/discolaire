"use client";

import type { Table } from "@tanstack/react-table";
import React from "react";
import { ChevronsUpDown, Trash2 } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { useCheckPermissions } from "~/hooks/use-permissions";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["all"]
>[number];

export function TransactionDataTableActions({
  table,
}: {
  table: Table<TransactionAllProcedureOutput>;
}) {
  const { t } = useLocale();
  const rows = table.getFilteredSelectedRowModel().rows;
  const confirm = useConfirm();

  const canDeleteTransaction = useCheckPermissions(
    PermissionAction.DELETE,
    "transaction",
  );
  const { openModal } = useModal();

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <div className="animate-fadeIn fixed inset-x-0 bottom-12 z-50 mx-auto flex h-[60px] max-w-xl items-center justify-between rounded-md border bg-background px-6 py-3 shadow">
      <p className="text-sm font-semibold">{rows.length} selected</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Export in csv</DropdownMenuItem>
          <DropdownMenuItem>Export in excel</DropdownMenuItem>
          {canDeleteTransaction && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  const selectedIds = rows.map((row) => row.original.id);
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    icon: <Trash2 className="h-6 w-6 text-destructive" />,
                    alertDialogTitle: {
                      className: "flex items-center gap-2",
                    },
                  });
                  if (isConfirmed) {
                    openModal({
                      title: t("delete"),
                      view: <DeleteTransaction transactionId={selectedIds} />,
                      className: "w-[400px]",
                    });
                  }
                }}
                className="cursor-pointer text-destructive focus:bg-[#FF666618] focus:text-destructive"
              >
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
