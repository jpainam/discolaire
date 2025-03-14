"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { RiDeleteBinLine } from "@remixicon/react";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

type CourseProcedureOutput = NonNullable<
  RouterOutputs["course"]["all"]
>[number];

export function CourseDataTableActions({
  table,
}: {
  table: Table<CourseProcedureOutput>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const canDeleteCourse = useCheckPermission(
    "classroom",
    PermissionAction.DELETE
  );
  const courseDeleteMutation = api.course.deleteMany.useMutation({
    onSettled: () => utils.course.invalidate(),
    onSuccess: () => {
      table.toggleAllRowsSelected(false);
      toast.success("deleted_successfully", { id: 0 });
      router.refresh();
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

  const confirm = useConfirm();

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && canDeleteCourse && (
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
              courseDeleteMutation.mutate(selectedIds);
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
          <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
