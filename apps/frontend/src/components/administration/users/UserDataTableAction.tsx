import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";

type User = RouterOutputs["user"]["all"][number];

export function UserDataTableAction({ table }: { table: Table<User> }) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteUsersMutation = useMutation(
    trpc.user.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        table.toggleAllRowsSelected(false);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
  const canDeleteUser = useCheckPermission("user", PermissionAction.DELETE);
  return (
    <>
      {canDeleteUser && table.getSelectedRowModel().rows.length > 0 && (
        <Button
          size={"sm"}
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              const selectedIds = rows.map((row) => row.original.id);
              deleteUsersMutation.mutate(selectedIds);
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
      )}
    </>
  );
}
