import { Skeleton } from "@repo/ui/skeleton";

import { SkeletonLineGroup } from "./data-table";

export default function HeaderSkeleton() {
  return (
    <div className="flex flex-col px-2">
      <div className="m-1 flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-1/3" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-56 rounded" />
          <Skeleton className="h-6 w-56 rounded" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
      <div className="m-1 flex justify-between">
        <Skeleton className="h-8 w-1/2 rounded-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-56 rounded" />
          <Skeleton className="h-8 w-6 rounded-md" />
        </div>
      </div>
      <div className="m-1 grid items-center gap-2">
        <SkeletonLineGroup
          columns={6}
          className="grid-cols-6 gap-1.5"
          skeletonClassName="h-4 w-full"
        />
      </div>
    </div>
  );
}
