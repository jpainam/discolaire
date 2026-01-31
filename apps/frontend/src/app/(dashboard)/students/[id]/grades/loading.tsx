import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Skeleton className="col-span-2 h-8 w-full" />
      <TableSkeleton rows={10} cols={2} />
      <Skeleton className="h-40" />
    </div>
  );
}
