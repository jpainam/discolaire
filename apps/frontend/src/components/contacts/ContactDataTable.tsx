"use client";

import React from "react";

import { DataTable, useDataTable } from "@repo/ui/datatable";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { ContactDataTableAction } from "./ContactDataTableAction";
import { getColumns } from "./ContactDataTableColumns";

export function ContactDataTable({
  contacts,
}: {
  contacts: RouterOutputs["contact"]["lastAccessed"];
}) {
  const { t } = useLocale();

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
