"use client";

import { useTranslations } from "next-intl";

import type { DataTableFilterField } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";

import type { SMSHistory } from "~/types/sms";
import { SMSHistoryDataTableActions } from "./SMSHistoryActions";
import { useSmsHistoryColumns } from "./SMSHistoryColumns";
import { SMSHistoryFloatingBar } from "./SMSHistoryFloatingBar";

export function SMSHistoryDataTable({
  count,
  smsHistory,
}: {
  count: number;
  smsHistory: SMSHistory[];
}) {
  const t = useTranslations();

  const columns = useSmsHistoryColumns();
  //const pageCount = Math.ceil(count / smsHistory.length);

  const filterFields: DataTableFilterField<SMSHistory>[] = [
    {
      label: t("message"),
      value: "message",
      placeholder: t("search"),
    },
    {
      label: t("status"),
      value: "status",
      options: ["female", "male"].map((gender) => ({
        label: t(gender),
        value: gender,
      })),
    },
  ];

  const { table } = useDataTable({
    data: smsHistory,
    columns: columns,
    rowCount: count,
    // optional props
    //filterFields: filterFields,
  });

  return (
    <DataTable
      table={table}
      floatingBar={<SMSHistoryFloatingBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <SMSHistoryDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
