"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { useBorrowBooksColumns } from "./LoanDataTableColumn";

export function BorrowBookDataTable() {
  const trpc = useTRPC();
  const { data: books } = useSuspenseQuery(
    trpc.library.borrowBooks.queryOptions({ limit: 2000 }),
  );

  const columns = useBorrowBooksColumns();

  const { table } = useDataTable({
    data: books,
    columns: columns,
  });
  return <DataTable className="" table={table}></DataTable>;
}
