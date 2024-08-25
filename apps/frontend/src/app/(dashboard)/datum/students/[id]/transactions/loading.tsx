import { DataTableSkeleton } from "@repo/ui/data-table/v2/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      rowCount={15}
      className="p-2"
      showViewOptions={false}
      withPagination={false}
      columnCount={6}
    />
  );
}
