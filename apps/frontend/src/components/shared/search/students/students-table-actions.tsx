import { ExportButton } from "@/components/shared/buttons/export-button";
import { useLocale } from "@/hooks/use-locale";
import { Student } from "@/types/student";
import { exportToCSV } from "@/utils/export-to-csv";
import { Table } from "@tanstack/react-table";
import { TFunction } from "i18next";

export function deleteSelectedRows({
  table,
  event,
  t,
}: {
  table: Table<Student>;
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  t: TFunction<string, unknown>;
}) {
  event?.preventDefault();
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: Student;
  }[];
  // toast.promise(
  //   Promise.all(
  //     selectedRows.map(async (row) =>true),
  //   ),
  //   {
  //     loading: t("deleting"),
  //     success: t("deleted_successfully"),
  //     error: (err) => getErrorMessage(err),
  //   },
  // );
}

export function TopBarContent(table: Table<Student>) {
  const { t } = useLocale();
  return (
    <ExportButton
      onExcelClick={() => {
        const columns = table
          .getAllColumns()
          .map((column) => column.id)
          .join(",");
        const data = table.getRowModel().rows.map((row) => row.original);
        exportToCSV(data, columns, t("students"));
      }}
    />
  );
}
