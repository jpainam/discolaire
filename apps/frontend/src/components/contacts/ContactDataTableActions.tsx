"use client";

import { DownloadIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { useSheet } from "~/hooks/use-sheet";
import { exportTableToCSV } from "~/lib/export";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import TrashIcon from "../icons/trash";
import CreateEditContact from "./CreateEditContact";

type ContactAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["contact"]["all"]>
>[number];

interface TasksTableToolbarActionsProps {
  table: Table<ContactAllProcedureOutput>;
}

export function ContactDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const deleteContactsMutation = api.contact.delete.useMutation();
  const utils = api.useUtils();
  return (
    <>
      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button
            onClick={() => {
              const selectedIds = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original.id);
              toast.promise(deleteContactsMutation.mutateAsync(selectedIds), {
                loading: t("deleting"),
                success: () => {
                  utils.contact.all.invalidate();
                  return t("deleted_successfully");
                },
              });
            }}
            variant={"outline"}
            className="h-8"
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            {t("delete")} ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}

        <Button
          onClick={() => {
            openSheet({
              placement: "right",
              className: "w-[700px]",
              view: <CreateEditContact />,
            });
          }}
          className="h-8"
          size="sm"
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" /> {t("new")}
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
          Export
        </Button>
        {/**
         * Other actions can be added here.
         * For example, import, view, etc.
         */}
      </div>
    </>
  );
}
