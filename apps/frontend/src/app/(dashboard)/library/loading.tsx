import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="grid gap-4 xl:w-[1/3] xl:grid-cols-8">
        {Array.from({ length: 6 }).map((_, t) => (
          <Skeleton key={t} className="h-8" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="col-span-2 h-20 xl:h-40" />
        <Skeleton className="h-20 xl:h-40" />
      </div>
    </div>
  );
}
