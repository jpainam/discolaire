import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-8 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
}
