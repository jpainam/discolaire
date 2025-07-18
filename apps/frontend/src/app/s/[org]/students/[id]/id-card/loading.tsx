import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 px-4 py-2 text-sm">
      <Skeleton className="h-8" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
