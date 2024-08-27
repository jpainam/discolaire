import { Skeleton } from "@repo/ui/skeleton";

import rangeMap from "~/lib/range-map";
import { cn } from "~/lib/utils";

interface DatatableSkeletonProps {
  rows: number;
}
export default function DatatableSkeleton({ rows }: DatatableSkeletonProps) {
  return (
    <>
      <div className="flex items-center gap-2 pb-2">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-[45%] rounded" />
        <Skeleton className="ml-auto h-8 w-16 rounded" />
      </div>
      {rangeMap(rows, (i) => (
        <div key={i}>
          <SkeletonLineGroup
            columns={6}
            className={`grid-cols-6 gap-2 pb-2 pt-2`}
            skeletonClassName="h-8 w-full"
          />
        </div>
      ))}
      <div className="flex items-center gap-2 pb-2">
        <Skeleton className="h-6 w-[10%] rounded" />
        <Skeleton className="ml-auto h-6 w-[25%] rounded" />
      </div>
    </>
  );
}

export function SkeletonLineGroup({
  columns = 1,
  className,
  skeletonClassName,
}: {
  columns: number;
  className?: string;
  skeletonClassName?: string;
}) {
  return (
    <>
      <div className={cn("grid", className)}>
        {rangeMap(columns, (i) => (
          <Skeleton key={i} className={cn("h-2 rounded", skeletonClassName)} />
        ))}
      </div>
    </>
  );
}
