import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Skeleton className="h-20" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="col-span-full h-20" />
      </div>
    </div>
  );
}
