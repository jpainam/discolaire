import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

export default function Loading() {
  return (
    <div className="container p-0">
      <DataTableSkeleton
        rowCount={15}
        columnCount={8}
        withPagination={false}
        showViewOptions={false}
      />
    </div>
  );
}
