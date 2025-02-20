import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      className="m-2"
      rowCount={15}
      columnCount={5}
      withPagination={false}
      showViewOptions={false}
    />
  );
}
