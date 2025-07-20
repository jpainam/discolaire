"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getBorrowBooksColumns } from "./LoanDataTableColumn";

export function BorrowBookDataTable() {
  const trpc = useTRPC();
  const { data: books } = useSuspenseQuery(
    trpc.library.borrowBooks.queryOptions({ limit: 2000 }),
  );
  const { t } = useLocale();
  const columns = React.useMemo(() => getBorrowBooksColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: books,
    columns: columns,
  });
  return <DataTable className="px-4" table={table}></DataTable>;
}
