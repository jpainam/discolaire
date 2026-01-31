import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Skeleton className="h-8" />
      <TableSkeleton rows={20} cols={8} />
    </div>
  );
}
