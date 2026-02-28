import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-20" />
    </div>
  );
}
