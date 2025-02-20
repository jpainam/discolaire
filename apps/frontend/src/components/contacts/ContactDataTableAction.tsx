import type { Table } from "@tanstack/react-table";
import * as React from "react";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { useConfirm } from "@repo/ui/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { api } from "~/trpc/react";

type Contact = RouterOutputs["contact"]["all"][number];

export function ContactDataTableAction({ table }: { table: Table<Contact> }) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();
  const { t } = useLocale();
  const deleteUsersMutation = api.contact.delete.useMutation({
    onSettled: () => utils.contact.invalidate(),
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      toast.success("deleted_successfully", { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

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
    <div className="animate-fadeIn fixed inset-x-0 bottom-12 z-50 mx-auto flex h-[60px] max-w-xl items-center justify-between rounded-md border bg-background px-6 py-3 shadow">
      <p className="text-sm font-semibold">
        {rows.length} {t("selected")}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{t("pdf_export")}</DropdownMenuItem>
          <DropdownMenuItem>{t("xml_export")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={async () => {
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
                deleteUsersMutation.mutate(selectedIds);
              }
            }}
            className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
          >
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
