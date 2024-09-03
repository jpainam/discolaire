import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";

export default function LoadingDashboard() {
  return (
    <DataTableSkeleton
      columnCount={8}
      rowCount={18}
      withPagination={false}
      showViewOptions={false}
    />
  );
}
