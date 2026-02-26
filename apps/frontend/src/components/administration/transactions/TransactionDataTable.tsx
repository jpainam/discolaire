"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import {
  DataTableToolbarV2,
  DataTableV2,
  DataTableViewOptionsV2,
  useDataTableV2,
} from "~/components/datatable_v2";
import { useTRPC } from "~/trpc/react";
import { TransactionDataTableAction } from "./TransactionDataTableAction";
import { useTransactionColumns } from "./TransactionDataTableColumn";

type TransactionRow = RouterOutputs["transaction"]["list"]["data"][number];

export function TransactionDataTable() {
  const trpc = useTRPC();
  const [from] = useQueryState("from");
  const [to] = useQueryState("to");
  const [status] = useQueryState("status");
  const [classroomId] = useQueryState("classroomId");
  const [journalId] = useQueryState("journalId");

  const columns = useTransactionColumns();
  const [tableData, setTableData] = React.useState<TransactionRow[]>([]);
  const [rowCount, setRowCount] = React.useState(0);

  const { table, state } = useDataTableV2({
    data: tableData,
    columns,
    pageSize: 30,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    columnVisibilityKey: "transaction-table-v2",
    initialState: {
      columnVisibility: {
        transactionType: false,
        journal: false,
        observation: false,
        //createdBy: false,
        receivedBy: false,
        receivedAt: false,
        updatedBy: false,
        method: false,
      },
    },
  });

  const queryInput = React.useMemo(
    () => ({
      pageSize: state.pagination.pageSize,
      search: state.globalFilter,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      status: status ?? undefined,
      classroomId: classroomId ?? undefined,
      journalId: journalId ?? undefined,
    }),
    [
      state.pagination.pageSize,
      state.globalFilter,
      from,
      to,
      status,
      classroomId,
      journalId,
    ],
  );

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      ...trpc.transaction.list.infiniteQueryOptions(queryInput, {
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
  }, [state.globalFilter, from, to, status, classroomId, journalId, table]);

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
          searchPlaceholder="Search transactions..."
          rightActions={<DataTableViewOptionsV2 table={table} />}
        >
          <TransactionDataTableAction table={table} />
        </DataTableToolbarV2>
      }
    />
  );
}
