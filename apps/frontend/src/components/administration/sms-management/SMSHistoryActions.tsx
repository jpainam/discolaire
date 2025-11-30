"use client";

import type { Table } from "@tanstack/react-table";
import { DownloadIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";

import type { SMSHistory } from "~/types/sms";
import { exportTableToCSV } from "~/lib/export";

interface TasksTableToolbarActionsProps {
  table: Table<SMSHistory>;
}

export function SMSHistoryDataTableActions({
  table,
}: TasksTableToolbarActionsProps) {
  const t = useTranslations();
  //const confirm = useConfirm();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          onClick={() => {
            // openAlert({
            //   title: t("delete"),
            //   description: t("delete_confirmation"),
            //   onConfirm: () => {
            //     console.log("delete");
            //   },
            //   onCancel: () => {
            //     closeAlert();
            //   },
            // });
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
          //   openSheet({
          //     className: "w-[700px]",
          //     title: t("add"),
          //     description: t("create"),
          //     view: <CreateEditStaff />,
          //   });
        }}
        className="h-8"
        variant="outline"
        size={"sm"}
      >
        <PlusIcon />
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
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
