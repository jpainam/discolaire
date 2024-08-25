"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { AppRouter } from "@/server/api/root";
import { useDateFormat } from "@/utils/date-format";
import { useDataTable } from "@repo/ui/data-table";
import { DataTable } from "@repo/ui/data-table/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/data-table-toolbar";
import { DataTableFilterField } from "@repo/ui/data-table/types";
import { inferProcedureOutput } from "@trpc/server";

import { TransactionDataTableActions } from "./TransactionDataTableActions";
import { fetchTransactionColumns } from "./TransactionDataTableColumns";

type StudentTransactionProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["student"]["transactions"]>
>[number];

export function TransactionDataTable({
  transactions,
  count,
}: {
  transactions: StudentTransactionProcedureOutput[];
  count: number;
}) {
  const { t } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  const params = useParams();
  const columns = useMemo(() => {
    return fetchTransactionColumns({
      t: t,
      dateFormatter: fullDateFormatter,
      studentId: params.id as string,
    });
  }, [t, fullDateFormatter, params.id]);

  const { table } = useDataTable({
    data: transactions || [],
    columns: columns,
    pageCount: Math.ceil(count / 10),
  });

  const filterFields: DataTableFilterField<StudentTransactionProcedureOutput>[] =
    [
      {
        label: t("description"),
        value: "description",
        placeholder: t("search"),
      },
      {
        label: t("status"),
        value: "status",
        options: ["IN_PROGRESS", "VALIDATED", "CANCELLED"].map((gender) => ({
          label: t(gender),
          value: gender,
        })),
      },
    ];

  return (
    <DataTable className="px-2" table={table} variant={"normal"}>
      <DataTableToolbar
        searchPlaceholder={t("search")}
        table={table}
        //filterFields={filterFields}
      >
        <TransactionDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
