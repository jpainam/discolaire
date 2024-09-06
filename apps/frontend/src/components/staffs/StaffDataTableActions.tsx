"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditStaff } from "./CreateEditStaff";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];

interface TasksTableToolbarActionsProps {
  table: Table<StaffProcedureOutput>;
}

export function StaffDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { t } = useLocale();
  const confirm = useConfirm();
  const canCreateStaff = useCheckPermissions(
    PermissionAction.CREATE,
    "staff:profile",
  );
  const canDeleteStaff = useCheckPermissions(
    PermissionAction.DELETE,
    "staff:profile",
  );
  const utils = api.useUtils();
  const deleteStaffMutation = api.staff.delete.useMutation({
    onSettled: () => utils.staff.invalidate(),
  });
  return (
    <div className="flex items-center gap-2">
      {canDeleteStaff && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              const ids = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);

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
          className="h-8"
          size="sm"
        >
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}

      {canCreateStaff && (
        <Button
          onClick={() => {
            openSheet({
              className: "w-[750px]",
              title: t("create"),
              view: <CreateEditStaff />,
            });
          }}
          className="h-8"
          variant="default"
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("new")}
        </Button>
      )}
      <Button
        variant="outline"
        className="h-8"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
