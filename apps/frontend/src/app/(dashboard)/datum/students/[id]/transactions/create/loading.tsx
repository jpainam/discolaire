import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      rowCount={15}
      withPagination={false}
      showViewOptions={false}
      columnCount={6}
    />
  );
}
