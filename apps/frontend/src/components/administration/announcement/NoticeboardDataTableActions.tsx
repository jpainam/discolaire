"use client";

import type {Table} from "@tanstack/react-table";
import type { inferProcedureOutput } from "@trpc/server";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { getErrorMessage } from "~/lib/handle-error";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { CreateEditAnnouncement } from "./CreateEditAnnouncement";

type AnnouncementAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["announcement"]["all"]>
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<AnnouncementAllProcedureOutput>;
}

export function NoticeboardDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const { openAlert, closeAlert } = useAlert();
  const { t } = useLocale();
  const deleteAnnouncementMutation = api.announcement.delete.useMutation();
  const utils = api.useUtils();

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          variant={"destructive"}
          onClick={() => {
            const selectedNotices = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original);
            openAlert({
              title: t("delete"),
              description: `${t("delete_confirmation")} ${selectedNotices.map((cl) => cl.title).join(", ")}?`,
              onConfirm: () => {
                toast.promise(
                  deleteAnnouncementMutation.mutateAsync(
                    selectedNotices.map((cl) => cl.id),
                  ),
                  {
                    loading: t("deleting"),
                    success: () => {
                      table.toggleAllRowsSelected(false);
                      closeAlert();
                      return t("deleted_successfully");
                    },
                    error: (error) => {
                      console.error(error);
                      return getErrorMessage(error);
                    },
                  },
                );
              },
              onCancel: () => {
                closeAlert();
                table.toggleAllRowsSelected(false);
              },
            });
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
      <Button
        size={"sm"}
        className="h-8"
        variant={"outline"}
        onClick={() => {
          openSheet({
            className: "w-[700px]",
            title: <div className="p-2">{t("create")}</div>,
            view: <CreateEditAnnouncement />,
          });
        }}
      >
        <Plus className="mr-2 size-4" aria-hidden="true" />
        {t("new")}
      </Button>
    </div>
  );
}
