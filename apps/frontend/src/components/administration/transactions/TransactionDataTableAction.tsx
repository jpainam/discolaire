"use client";

import type { Table } from "@tanstack/react-table";
import React from "react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine } from "@remixicon/react";
import { DeleteTransaction } from "~/components/students/transactions/DeleteTransaction";
import { useCheckPermission } from "~/hooks/use-permission";

type TransactionAllProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["all"]
>[number];

export function TransactionDataTableAction({
  table,
}: {
  table: Table<TransactionAllProcedureOutput>;
}) {
  const { t } = useLocale();
  const rows = table.getFilteredSelectedRowModel().rows;
  const confirm = useConfirm();

  const canDeleteTransaction = useCheckPermission(
    "transaction",
    PermissionAction.DELETE
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
    <>
      {rows.length > 0 && canDeleteTransaction && (
        <>
          <Button
            onClick={async () => {
              const selectedIds = rows.map((row) => row.original.id);
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
                // icon: <Trash2 className="text-destructive" />,
                // alertDialogTitle: {
                //   className: "flex items-center gap-2",
                // },
              });
              if (isConfirmed) {
                openModal({
                  title: t("delete"),
                  view: <DeleteTransaction transactionId={selectedIds} />,
                });
              }
            }}
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
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
        </>
      )}
    </>
  );
}
