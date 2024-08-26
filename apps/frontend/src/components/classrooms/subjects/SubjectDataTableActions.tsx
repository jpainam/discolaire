"use client";

import { useParams } from "next/navigation";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { exportTableToCSV } from "~/lib/export";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateEditSubject } from "./CreateEditSubject";

type SubjectGetQueryOutput = NonNullable<
  inferProcedureOutput<AppRouter["subject"]["get"]>
>;

interface SubjectToolbarActionsProps {
  table: Table<SubjectGetQueryOutput>;
}

export function SubjectDataTableActions({ table }: SubjectToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams() as { id: string };
  const { openAlert, closeAlert } = useAlert();
  const deleteSubjectMutation = api.subject.delete.useMutation();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={() => {
            openAlert({
              title: t("delete"),
              description: t("delete_confirmation"),
              onConfirm: () => {
                const selectedIds = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original.id);

                toast.promise(deleteSubjectMutation.mutateAsync(selectedIds), {
                  loading: t("deleting"),
                  success: () => {
                    table.toggleAllRowsSelected(false);
                    closeAlert();
                    return t("deleted_successfully");
                  },
                  error: (err) => {
                    return getErrorMessage(err);
                  },
                });
              },
              onCancel: () => {
                closeAlert();
              },
            });
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
        className="h-8"
        variant="outline"
        size={"sm"}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        {t("new")}
      </Button>
      <Button
        variant="outline"
        className="h-8"
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
