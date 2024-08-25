import { Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { ExportButton } from "~/components/shared/buttons/export-button";
import { getErrorMessage } from "~/lib/handle-error";
import { Student } from "~/types/student";

export function deleteSelectedRows({
  table,
  event,
}: {
  table: Table<Student>;
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
}) {
  event?.preventDefault();
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: Student;
  }[];

  //noStore();
  toast.promise(
    Promise.all(
      /*selectedRows.map(async (row) =>
        deleteTask({
          id: row.original.id,
        })
      )*/ [],
    ),
    {
      loading: "Deleting...",
      success: "Tasks deleted",
      error: (err) => getErrorMessage(err),
    },
  );
}

export function TopBarContent(table: Table<Student>) {
  return <ExportButton />;
}
