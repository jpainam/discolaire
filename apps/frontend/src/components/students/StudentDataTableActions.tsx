"use client";

import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type StudentGetAllProcedureOutput = NonNullable<
  RouterOutputs["enrollment"]["all"]
>[number];

export function StudentDataTableActions({
  table,
}: {
  table: Table<StudentGetAllProcedureOutput>;
}) {
  const confirm = useConfirm();

  const t = useTranslations();

  const canDeleteStudent = useCheckPermission(
    "student",
    PermissionAction.DELETE,
  );
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const deleteStudentMutation = useMutation(
    trpc.student.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.enrollment.pathFilter());
        table.toggleAllRowsSelected(false);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
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
              // icon: <Trash2 className="text-destructive" />,
              // alertDialogTitle: {
              //   className: "flex items-center gap-2",
              // },
            });

            if (isConfirmed) {
              const selectedStudentIds = rows.map((row) => row.original.id);
              toast.loading(t("deleting"), { id: 0 });
              deleteStudentMutation.mutate(selectedStudentIds);
            }
          }}
          variant={"destructive"}
        >
          <Trash2 />
          {t("delete")}
          <span className="border-border bg-background text-muted-foreground ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"}>
            {t("bulk_actions")} <ChevronsUpDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{t("pdf_export")}</DropdownMenuItem>
          <DropdownMenuItem>{t("xml_export")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}
