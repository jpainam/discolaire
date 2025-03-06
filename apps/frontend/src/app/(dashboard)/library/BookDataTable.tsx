import type { RouterOutputs } from "@repo/api";
import { useDataTable } from "@repo/ui/datatable/index";
import React from "react";
import { useLocale } from "~/i18n";
import { getBookColumns } from "./BookDataTableColumn";

export function BookDataTable({
  books,
}: {
  books: RouterOutputs["book"]["lastBorrowed"];
}) {
  const { t } = useLocale();
  const columns = React.useMemo(() => getBookColumns({ t: t }), [t]);

  const { table } = useDataTable({
    data: books,
    columns: columns,
  });
  return <div></div>;
}
