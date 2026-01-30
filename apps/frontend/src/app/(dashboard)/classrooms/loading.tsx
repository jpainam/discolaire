import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid items-center gap-4 xl:flex">
        <Skeleton className="h-8 w-full flex-1" />
        <Skeleton className="h-8 xl:w-[80px]" />
        <Skeleton className="h-8 xl:w-[80px]" />
      </div>
      <div className="grid gap-4 xl:grid-cols-7">
        <Skeleton className="col-span-4 h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
      <TableSkeleton rows={20} cols={9} />
    </div>
  );
}
