import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, t) => (
          <Skeleton className="h-8" key={t} />
        ))}
      </div>
      <TableSkeleton rows={10} cols={6} />
    </div>
  );
}
