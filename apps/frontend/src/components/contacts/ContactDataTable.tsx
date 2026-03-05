"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { ContactDataTableAction } from "./ContactDataTableAction";
import {
  contactDefaultColumnVisibility,
  useContactColumns,
} from "./ContactDataTableColumn";

type Contact = RouterOutputs["contact"]["all"]["data"][number];

export function ContactDataTable() {
  const trpc = useTRPC();
  const columns = useContactColumns();
  const [tableData, setTableData] = React.useState<Contact[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const { table, state } = useDataTableV2({
    data: tableData,
    columns,
    pageSize: 20,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnVisibilityKey: "contacts-table-v2",
    initialState: {
      columnVisibility: contactDefaultColumnVisibility,
    },
  });

  const queryInput = React.useMemo(
    () => ({
      pageSize: state.pagination.pageSize,
      search: state.globalFilter,
      sorting: state.sorting.map((sort) => ({
        id: sort.id,
        desc: sort.desc,
      })),
    }),
    [state.pagination.pageSize, state.globalFilter, state.sorting],
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      ...trpc.contact.all.infiniteQueryOptions(queryInput, {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }),
    });

  React.useEffect(() => {
    const pages = data?.pages ?? [];
    if (
      state.pagination.pageIndex >= pages.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    state.pagination.pageIndex,
  ]);

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [state.globalFilter, state.sorting, table]);

  React.useEffect(() => {
    const pages = data?.pages ?? [];
    setRowCount(pages[0]?.rowCount ?? 0);
    setTableData(pages[state.pagination.pageIndex]?.data ?? []);
  }, [data, state.pagination.pageIndex]);

  return (
    <DataTableV2
      table={table}
      isLoading={isFetching || isFetchingNextPage}
      toolbar={
        <DataTableToolbarV2
          table={table}
          searchPlaceholder="Rechercher un contact..."
        >
          <DataTableViewOptionsV2 table={table} />
          <ContactDataTableAction table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
