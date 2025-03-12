"use client";
import type { RouterOutputs } from "@repo/api";
import { DataTable, useDataTable } from "@repo/ui/datatable";
import React from "react";
import { useLocale } from "~/i18n";
import { getBorrowBooksColumns } from "./LoanDataTableColumn";

export function BorrowBookDataTable({
  books,
}: {
  books: RouterOutputs["library"]["borrowBooks"];
}) {
  const { t } = useLocale();
  const columns = React.useMemo(() => getBorrowBooksColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: books,
    columns: columns,
  });
  return <DataTable className="px-4" table={table}></DataTable>;
}
