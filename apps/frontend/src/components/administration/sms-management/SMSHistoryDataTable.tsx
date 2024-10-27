"use client";

import { useMemo } from "react";

import type { DataTableFilterField } from "@repo/ui/datatable/data-table-toolbar";
import { useLocale } from "@repo/i18n";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { DataTable, useDataTable } from "@repo/ui/datatable/index";

import type { SMSHistory } from "~/types/sms";
import { useDateFormat } from "~/utils/date-format";
import { SMSHistoryDataTableActions } from "./SMSHistoryActions";
import { fetchSmsHistoryColumns } from "./SMSHistoryColumns";
import { SMSHistoryFloatingBar } from "./SMSHistoryFloatingBar";

export function SMSHistoryDataTable({
  count,
  smsHistory,
}: {
  count: number;
  smsHistory: SMSHistory[];
}) {
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  const columns = useMemo(() => {
    const columns = fetchSmsHistoryColumns({
      t: t,
      dateFormatter: fullDateFormatter,
    });
    return columns;
  }, [t, fullDateFormatter]);
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
