import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return <DataTableSkeleton columnCount={8} rowCount={15} />;
}
