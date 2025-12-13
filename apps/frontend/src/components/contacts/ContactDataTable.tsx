"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { DataTable, useDataTable } from "~/components/datatable";
import { useTRPC } from "~/trpc/react";
import { ContactDataTableAction } from "./ContactDataTableAction";
import { getColumns } from "./ContactDataTableColumn";

export function ContactDataTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: contacts } = useSuspenseQuery(trpc.contact.all.queryOptions());

  const columns = React.useMemo(() => getColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: contacts,
    columns: columns,
  });

  return (
    <DataTable table={table}>
      <ContactDataTableAction table={table} />
    </DataTable>
  );
}
