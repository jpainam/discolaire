import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Skeleton className="h-8" />
      <TableSkeleton rows={4} cols={5} />
    </div>
  );
}
