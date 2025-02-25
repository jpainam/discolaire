"use client";

import React from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { DataTableToolbar } from "@repo/ui/datatable/data-table-toolbar";
import { useLocale } from "~/i18n";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { ContactDataTableAction } from "./ContactDataTableAction";
import { getColumns } from "./ContactDataTableColumns";

export function ContactDataTable({ className }: { className?: string }) {
  const { t } = useLocale();
  //const searchParams = useSearchParams();
  const contactsQuery = api.contact.all.useQuery({});
  // const contactsQuery = api.contact.all.useQuery({
  //   per_page: isNaN(Number(searchParams.get("per_page")))
  //     ? undefined
  //     : Number(searchParams.get("per_page")),
  //   page: isNaN(Number(searchParams.get("page")))
  //     ? undefined
  //     : Number(searchParams.get("page")),
  //   sort: searchParams.get("sort") ?? undefined,
  //   q: searchParams.get("lastName") ?? undefined,
  // });

  const countQuery = api.contact.count.useQuery();
  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: contactsQuery.data ?? [],
    columns: columns,
    rowCount: countQuery.data?.total ?? 1,
  });

  if (contactsQuery.isPending) {
    return (
      <DataTableSkeleton
        rowCount={18}
        className="p-2"
        columnCount={8}
        withPagination={false}
        showViewOptions={false}
      />
    );
  }

  return (
    <DataTable
      className={cn(className)}
      table={table}
      floatingBar={<ContactDataTableAction table={table} />}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
