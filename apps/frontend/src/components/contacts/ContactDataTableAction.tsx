import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { RiDeleteBinLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type Contact = RouterOutputs["contact"]["all"][number];

export function ContactDataTableAction({ table }: { table: Table<Contact> }) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const t = useTranslations();
  const canDeleteContact = useCheckPermission("contact", "delete");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteContactMutation = useMutation(
    trpc.contact.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
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

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteContact && (
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
              deleteContactMutation.mutate(selectedIds);
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
          <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
