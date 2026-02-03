import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Skeleton className="h-20" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-1/2" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-full" />
          <Skeleton className="h-ful" />
        </div>
        <Skeleton />
      </div>
      <Skeleton className="h-20" />
    </div>
  );
}
