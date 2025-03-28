import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 px-2 pb-2 md:grid-cols-2">
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        columnCount={2}
        rowCount={4}
      />
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        columnCount={2}
        rowCount={4}
      />
    </div>
  );
}
