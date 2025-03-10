"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine } from "@remixicon/react";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];

export function StaffDataTableActions({
  table,
}: {
  table: Table<StaffProcedureOutput>;
}) {
  const { t } = useLocale();
  const router = useRouter();

  const canDeleteStaff = useCheckPermissions(
    PermissionAction.DELETE,
    "staff:profile"
  );
  const utils = api.useUtils();
  const deleteStaffMutation = api.staff.delete.useMutation({
    onSettled: () => utils.staff.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const rows = table.getFilteredSelectedRowModel().rows;

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

  const confirm = useConfirm();

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteStaff && (
        <>
          <Button
            size={"sm"}
            onClick={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                const ids = rows.map((row) => row.original.id);

                toast.promise(deleteStaffMutation.mutateAsync(ids), {
                  loading: t("deleting"),
                  success: () => {
                    table.toggleAllRowsSelected(false);
                    return t("deleted_successfully");
                  },
                  error: (err) => {
                    return getErrorMessage(err);
                  },
                });
              }
            }}
            variant="destructive"
            //className="dark:data-[variant=destructive]:focus:bg-destructive/10"
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
