import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <div className="w-full pt-[90px]">
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        rowCount={15}
        columnCount={8}
      />
    </div>
  );
}
