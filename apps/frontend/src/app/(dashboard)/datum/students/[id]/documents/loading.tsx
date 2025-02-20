import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      className="m-2"
      showViewOptions={false}
      rowCount={10}
      columnCount={6}
      withPagination={false}
    />
  );
}
