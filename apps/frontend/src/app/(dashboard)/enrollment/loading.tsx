import { DataTableSkeleton } from "@repo/ui/components/datatable/data-table-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <DataTableSkeleton rowCount={15} columnCount={8} />
    </div>
  );
}
