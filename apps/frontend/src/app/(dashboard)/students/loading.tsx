import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Skeleton className="h-20" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="flex grid w-[1/3] grid-cols-2 items-center gap-4">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
    </div>
  );
}
