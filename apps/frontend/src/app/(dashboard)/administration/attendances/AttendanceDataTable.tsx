"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { AttendanceDataTableAction } from "./AttendanceDataTableAction";
import { useColumns } from "./AttendanceDataTableColumn";

type AttendanceRow = RouterOutputs["attendance"]["list"]["data"][number];

export function AttendanceDataTable() {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");

  const columns = useColumns();
  const [tableData, setTableData] = React.useState<AttendanceRow[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const { table, state } = useDataTableV2({
    data: tableData,
    columns,
    pageSize: 30,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnVisibilityKey: "attendance-table-v2",
  });

  const queryInput = React.useMemo(
    () => ({
      pageSize: state.pagination.pageSize,
      search: state.globalFilter,
      termId,
    }),
    [state.pagination.pageSize, state.globalFilter, termId],
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      ...trpc.attendance.list.infiniteQueryOptions(queryInput, {
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
  }, [state.globalFilter, termId, table]);

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
        <DataTableToolbarV2
          table={table}
          searchPlaceholder="Search by student name..."
        >
          <AttendanceDataTableAction table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
