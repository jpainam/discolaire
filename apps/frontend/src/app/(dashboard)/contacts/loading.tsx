import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid items-center gap-4 xl:flex">
        <Skeleton className="h-8 xl:w-[2/3]" />
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[10px]" />
      </div>
      <Separator />
      <TableSkeleton rows={20} cols={8} />
    </div>
  );
}
