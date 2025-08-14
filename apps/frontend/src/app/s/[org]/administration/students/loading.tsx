import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="flex flex-1">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
