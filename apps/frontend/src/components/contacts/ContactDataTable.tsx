"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable, useDataTable } from "@repo/ui/datatable";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { ContactDataTableAction } from "./ContactDataTableAction";
import { getColumns } from "./ContactDataTableColumn";

export function ContactDataTable() {
  const { t } = useLocale();
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
