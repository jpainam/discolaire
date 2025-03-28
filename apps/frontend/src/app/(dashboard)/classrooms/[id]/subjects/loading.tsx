import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

export default function Loading() {
  return <DataTableSkeleton rowCount={8} columnCount={4} />;
}
