import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      className="p-2"
      withPagination={false}
      showViewOptions={false}
      rowCount={10}
      columnCount={8}
    />
  );
}
