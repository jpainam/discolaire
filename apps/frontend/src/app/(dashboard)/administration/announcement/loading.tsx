import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

export default function Loading() {
  return (
    <div className="w-full p-2">
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        rowCount={15}
        columnCount={8}
      />
    </div>
  );
}
