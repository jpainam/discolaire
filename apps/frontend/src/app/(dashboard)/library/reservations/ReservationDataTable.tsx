"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { useReservationColumns } from "./ReservationDataTableColumn";

export function ReservationDataTable() {
  const trpc = useTRPC();
  const { data: books } = useSuspenseQuery(
    trpc.library.borrowBooks.queryOptions({ limit: 2000 }),
  );
  const today = new Date();

  const columns = useReservationColumns();

  const { table } = useDataTable({
    data: books.filter((book) => book.borrowed > today),
    columns: columns,
  });
  return <DataTable className="px-4" table={table}></DataTable>;
}
