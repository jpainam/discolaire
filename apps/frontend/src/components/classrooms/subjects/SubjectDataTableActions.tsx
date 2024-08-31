"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditSubject } from "./CreateEditSubject";

type SubjectGetQueryOutput = NonNullable<RouterOutputs["subject"]["get"]>;

interface SubjectToolbarActionsProps {
  table: Table<SubjectGetQueryOutput>;
}

export function SubjectDataTableActions({ table }: SubjectToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { t } = useLocale();
  const confirm = useConfirm();
  const deleteSubjectMutation = api.subject.delete.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("are_you_sure"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);

              toast.promise(deleteSubjectMutation.mutateAsync(selectedIds), {
                loading: t("deleting"),
                success: () => {
                  table.toggleAllRowsSelected(false);
                  return t("deleted_successfully");
                },
                error: (err) => {
                  return getErrorMessage(err);
                },
              });
            }
          }}
          variant="destructive"
          className="h-8"
          size="sm"
        >
          <Trash2 className="mr-2 size-4" aria-hidden="true" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}

      <Button
        onClick={() => {
          openSheet({
            title: <div className="px-2">{t("create")}</div>,
            view: <CreateEditSubject />,
          });
        }}
        size={"sm"}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        {t("new")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        {t("export")}
      </Button>
    </div>
  );
}
