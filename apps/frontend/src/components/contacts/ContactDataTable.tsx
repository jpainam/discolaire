"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { inferProcedureOutput } from "@trpc/server";

import type { DataTableFilterField } from "@repo/ui/data-table/v2/datatypes";
import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { DataTable } from "@repo/ui/data-table/v2/data-table";
import { DataTableToolbar } from "@repo/ui/data-table/v2/data-table-toolbar";
import { useDataTable } from "@repo/ui/data-table/v2/use-data-table";

import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { ContactDataTableActions } from "./ContactDataTableActions";
import { getColumns } from "./ContactDataTableColumns";

type ContactAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["contact"]["all"]>
>[number];

export function ContactDataTable({ className }: { className?: string }) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const contactsQuery = api.contact.all.useQuery({
    per_page: isNaN(Number(searchParams.get("per_page")))
      ? undefined
      : Number(searchParams.get("per_page")),
    page: isNaN(Number(searchParams.get("page")))
      ? undefined
      : Number(searchParams.get("page")),
    sort: searchParams.get("sort") || undefined,
    q: searchParams.get("lastName") || undefined,
  });

  const countQuery = api.contact.count.useQuery();
  const columns = React.useMemo(() => getColumns({ t: t }), [t]);
  // const {
  //   data: count,
  //   isPending,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: [tags.contacts.list, "count"],
  //   queryFn: async () => {
  //     return await getContactCount();
  //   },
  // });
  const filterFields: DataTableFilterField<ContactAllProcedureOutput>[] = [
    {
      label: t("firstName"),
      value: "firstName",
      placeholder: t("search"),
    },
    {
      label: t("gender"),
      value: "gender",
      options: ["female", "male"].map((gender) => ({
        label: gender,
        value: gender,
        withCount: true,
      })),
    },
  ];
  const pageCount = countQuery.data
    ? Math.ceil(countQuery.data / (contactsQuery.data?.length || 1))
    : 1;

  const { table } = useDataTable({
    data: contactsQuery.data || [],
    columns: columns,
    pageCount: pageCount,
    // optional props
    filterFields: filterFields,
    defaultPerPage: 30,
    defaultSort: "createdAt.desc",
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
      variant="compact"
      className="p-2"
      table={table}
      //floatingBar={<ContactDataTableBar table={table} />}
    >
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ContactDataTableActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
