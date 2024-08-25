import { DataTableSkeleton } from "@repo/ui/data-table/v2/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      showViewOptions={false}
      withPagination={false}
      columnCount={2}
    />
  );
}
