import { Skeleton } from "@repo/ui/skeleton";

import { SkeletonLineGroup } from "~/components/skeletons/data-table";

export default function SearchSkeleton() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-56 rounded" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonLineGroup
          columns={6}
          className="grid-cols-6 gap-1.5"
          skeletonClassName="h-4 w-24"
        />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-[45%] rounded" />
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="ml-auto h-8 w-16 rounded" />
      </div>
      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
}
