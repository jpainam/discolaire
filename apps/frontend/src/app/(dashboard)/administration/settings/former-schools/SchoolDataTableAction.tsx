import type { Table } from "@tanstack/react-table";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";

type FormerSchool = RouterOutputs["formerSchool"]["all"][number];

export function SchoolDataTableAction({
  table,
}: {
  table: Table<FormerSchool>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();
  const { t } = useLocale();
  const deleteSchoolsMutation = api.formerSchool.delete.useMutation({
    onSettled: () => utils.user.invalidate(),
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
          <DropdownMenuItem>Export in csv</DropdownMenuItem>
          <DropdownMenuItem>Export in excel</DropdownMenuItem>
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
                deleteSchoolsMutation.mutate(selectedIds);
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
