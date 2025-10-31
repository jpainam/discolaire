import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6 p-4 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}
