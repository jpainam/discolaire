import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <div className="col-span-full grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, t) => (
          <Skeleton className="h-20" key={t} />
        ))}
      </div>
      <Skeleton className="col-span-2 h-20" />
      <Skeleton className="col-span-2 h-20" />
      <Skeleton className="h-20" />
      <Skeleton className="col-span-3 h-20" />
      <Skeleton className="col-span-2 h-20" />
      <Skeleton className="col-span-2 h-20" />
      <Skeleton className="col-span-3 h-20" />
    </div>
  );
}
