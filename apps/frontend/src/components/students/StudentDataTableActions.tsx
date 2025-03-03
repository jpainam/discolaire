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
    "student:profile"
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
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteStudent && (
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
              const selectedStudentIds = rows.map((row) => row.original.id);
              toast.loading("deleting", { id: 0 });
              deleteStudentMutation.mutate(selectedStudentIds);
            }
          }}
          variant={"destructive"}
        >
          <Trash2 />
          {t("delete")}
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{t("pdf_export")}</DropdownMenuItem>
          <DropdownMenuItem>{t("xml_export")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
