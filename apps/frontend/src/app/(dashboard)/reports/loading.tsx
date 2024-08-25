import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

export default function Loading() {
  return <DataTableSkeleton rowCount={15} columnCount={8} />;
}
