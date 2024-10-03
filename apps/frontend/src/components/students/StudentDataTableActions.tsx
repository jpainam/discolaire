"use client";

import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { api } from "~/trpc/react";

type StudentGetAllProcedureOutput = NonNullable<
  RouterOutputs["student"]["all"]
>[number];

export function StudentDataTableActions({
  table,
}: {
  table: Table<StudentGetAllProcedureOutput>;
}) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteStudentMutation = api.student.delete.useMutation({
    onSettled: () => utils.student.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      toast.success("deleted_successfully", { id: 0 });
    },
  });
  const rows = table.getFilteredSelectedRowModel().rows;

  const deleteUsersMutation = api.user.delete.useMutation({
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
  useEffect(() => {
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
                const selectedStudentIds = rows.map((row) => row.original.id);
                toast.loading("deleting", { id: 0 });
                deleteStudentMutation.mutate(selectedStudentIds);
              }
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
