import React from "react";

import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { getBookColumns } from "./BookDataTableColumn";

export function BookDataTable({
  books,
}: {
  books: RouterOutputs["book"]["recentlyUsed"];
}) {
  const { t } = useLocale();
  const columns = React.useMemo(() => getBookColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: books,
    columns: columns,
  });
  return <DataTable table={table}></DataTable>;
}
