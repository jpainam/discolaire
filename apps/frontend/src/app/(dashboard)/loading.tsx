import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <DataTableSkeleton
      columnCount={4}
      rowCount={18}
      className="pt-[100px]"
      withPagination={false}
      showViewOptions={false}
    />
  );
}
