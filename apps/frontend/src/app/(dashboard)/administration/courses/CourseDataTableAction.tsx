"use client";

import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { RiDeleteBinLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type CourseProcedureOutput = NonNullable<
  RouterOutputs["course"]["all"]
>[number];

export function CourseDataTableActions({
  table,
}: {
  table: Table<CourseProcedureOutput>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const t = useTranslations();

  const canDeleteCourse = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const courseDeleteMutation = useMutation(
    trpc.course.deleteMany.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.course.all.pathFilter());
        table.toggleAllRowsSelected(false);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
          <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {table.getSelectedRowModel().rows.length}
          </span>
        </Button>
      )}
    </>
  );
}
