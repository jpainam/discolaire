"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { useEffect } from "react";
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
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useCheckPermissions } from "~/hooks/use-permissions";
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
  const canDeleteStudent = useCheckPermissions(
    PermissionAction.DELETE,
    "student:profile",
  );
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
          {canDeleteStudent && (
            <>
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
                    const selectedStudentIds = rows.map(
                      (row) => row.original.id,
                    );
                    toast.loading("deleting", { id: 0 });
                    deleteStudentMutation.mutate(selectedStudentIds);
                  }
                }}
                className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
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
