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
import { useUserColumns } from "./UserDataTableColumn";

type User = RouterOutputs["user"]["all"]["data"][number];

export function UserDataTableV2Test() {
  const trpc = useTRPC();
  const columns = useUserColumns();
  const [tableData, setTableData] = React.useState<User[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const { table, state } = useDataTableV2({
    data: tableData,
    columns,
    pageSize: 20,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnVisibilityKey: "users-table-v2",
  });

  const queryInput = React.useMemo(
    () => ({
      pageSize: state.pagination.pageSize,
      search: state.globalFilter,
      filters: state.columnFilters.map((filter) => ({
        id: filter.id,
        value: Array.isArray(filter.value)
          ? filter.value.map((item) => String(item))
          : typeof filter.value === "string"
            ? filter.value
            : filter.value == null
              ? undefined
              : // eslint-disable-next-line @typescript-eslint/no-base-to-string
                String(filter.value),
      })),
      sorting: state.sorting.map((sort) => ({
        id: sort.id,
        desc: sort.desc,
      })),
    }),
    [
      state.pagination.pageSize,
      state.globalFilter,
      state.columnFilters,
      state.sorting,
    ],
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      ...trpc.user.all.infiniteQueryOptions(queryInput, {
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      }),
    });

  const profileOptions = React.useMemo(() => {
    const uniqueProfiles = Array.from(
      new Set(tableData.map((user) => user.profile).filter(Boolean)),
    );
    return uniqueProfiles.sort().map((profile) => ({
      label: String(profile),
      value: String(profile),
    }));
  }, [tableData]);

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
  }, [state.columnFilters, state.globalFilter, state.sorting, table]);

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
          // rightActions={<Button variant="outline">Print</Button>}
          searchPlaceholder="Search users..."
          filterFields={[
            {
              id: "profile",
              label: "Profile",
              options: profileOptions,
            },
          ]}
        >
          <DataTableViewOptionsV2 table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
