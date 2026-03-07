"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { getBookColumns } from "./BookDataTableColumn";

export function BookDashboardDataTable() {
  const trpc = useTRPC();
  const t = useTranslations();
  const { data: books = [], isFetching } = useQuery(
    trpc.book.recentlyUsed.queryOptions(),
  );

  const columns = useMemo(() => getBookColumns({ t }), [t]);

  const { table } = useDataTableV2({
    data: books,
    columns,
    pageSize: 20,
    columnVisibilityKey: "books-dashboard-table-v2",
  });

  return (
    <DataTableV2
      table={table}
      isLoading={isFetching}
      toolbar={
        <DataTableToolbarV2
          table={table}
          searchPlaceholder="Rechercher un livre..."
        >
          <DataTableViewOptionsV2 table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
