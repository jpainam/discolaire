"use client";

import type { Table } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditAnnouncement } from "./CreateEditAnnouncement";

type AnnouncementAllProcedureOutput = NonNullable<
  RouterOutputs["announcement"]["all"]
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<AnnouncementAllProcedureOutput>;
}

export function NoticeboardDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteAnnouncementMutation = api.announcement.delete.useMutation({
    onSettled: () => utils.announcement.invalidate(),
  });

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          variant={"destructive"}
          onClick={async () => {
            const selectedNotices = table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original);
            const isConfirmed = await confirm({
              title: t("delete"),
              confirmText: t("delete"),
              cancelText: t("cancel"),
              description: `${t("delete_confirmation")} ${selectedNotices.map((cl) => cl.title).join(", ")}?`,
            });
            if (isConfirmed) {
              toast.promise(
                deleteAnnouncementMutation.mutateAsync(
                  selectedNotices.map((cl) => cl.id),
                ),
                {
                  loading: t("deleting"),
                  success: () => {
                    table.toggleAllRowsSelected(false);
                    return t("deleted_successfully");
                  },
                  error: (error) => {
                    console.error(error);
                    return getErrorMessage(error);
                  },
                },
              );
            }
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
