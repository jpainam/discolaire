import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

export default function LoadingDashboard() {
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
