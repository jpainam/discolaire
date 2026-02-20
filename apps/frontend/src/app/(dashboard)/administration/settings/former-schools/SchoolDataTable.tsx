"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { SchoolDataTableAction } from "./SchoolDataTableAction";
import { useSchoolColumns } from "./SchoolDataTableColumn";

type FormerSchool = RouterOutputs["formerSchool"]["list"]["data"][number];

export function SchoolDataTable() {
  const trpc = useTRPC();
  const columns = useSchoolColumns();
  const [tableData, setTableData] = React.useState<FormerSchool[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const { table, state } = useDataTableV2({
    data: tableData,
    columns,
    pageSize: 30,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnVisibilityKey: "former-schools-table-v2",
  });

  const queryInput = React.useMemo(
    () => ({
      pageSize: state.pagination.pageSize,
      search: state.globalFilter,
    }),
    [state.pagination.pageSize, state.globalFilter],
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      ...trpc.formerSchool.list.infiniteQueryOptions(queryInput, {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }),
    });

  React.useEffect(() => {
    const pageCount = data?.pages.length ?? 0;
    if (
      state.pagination.pageIndex >= pageCount &&
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
  }, [state.globalFilter, table]);

  React.useEffect(() => {
    const pages = data?.pages ?? [];
    const page = pages[state.pagination.pageIndex];
    setRowCount(page?.rowCount ?? 0);
    setTableData(page?.data ?? []);
  }, [data, state.pagination.pageIndex]);

  return (
    <DataTableV2
      table={table}
      isLoading={isFetching || isFetchingNextPage}
      toolbar={
        <DataTableToolbarV2 table={table} searchPlaceholder="Search schools...">
          <SchoolDataTableAction table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
