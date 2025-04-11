"use client";

import type { Table } from "@tanstack/react-table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
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
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteAnnouncementMutation = useMutation(
    trpc.announcement.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.announcement.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        table.toggleAllRowsSelected(false);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

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
              toast.loading(t("deleting"), { id: 0 });
              deleteAnnouncementMutation.mutate(
                selectedNotices.map((cl) => cl.id)
              );
            }
          }}
        >
          <Trash2 />
          {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      ) : null}
      <Button
        size={"sm"}
        className="h-8"
        variant={"outline"}
        onClick={() => {
          openSheet({
            title: t("create"),
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
