import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 p-4 xl:grid-cols-3">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  );
}
