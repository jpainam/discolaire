"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useTRPC } from "~/trpc/react";
import { getReservationColumns } from "./ReservationDataTableColumn";

export function ReservationDataTable() {
  const trpc = useTRPC();
  const { data: books } = useSuspenseQuery(
    trpc.library.borrowBooks.queryOptions({ limit: 2000 }),
  );
  const today = new Date();

  const t = useTranslations();
  const columns = React.useMemo(() => getReservationColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: books.filter((book) => book.borrowed > today),
    columns: columns,
  });
  return <DataTable className="px-4" table={table}></DataTable>;
}
