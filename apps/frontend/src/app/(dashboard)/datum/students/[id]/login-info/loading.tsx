import { SkeletonLineGroup } from "@/components/skeletons/data-table";
import { Skeleton } from "@repo/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonLineGroup columns={6} />
      <Skeleton className="h-5 w-[25%]" />
      <Skeleton className="h-5 w-[50%]" />
      <Skeleton className="h-5 w-[75%]" />
      <Skeleton className="h-5 w-full" />
    </div>
  );
}
