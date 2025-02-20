import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 px-2 pb-2 md:grid-cols-2">
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        columnCount={4}
        rowCount={8}
      />
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        columnCount={4}
        rowCount={8}
      />
    </div>
  );
}
