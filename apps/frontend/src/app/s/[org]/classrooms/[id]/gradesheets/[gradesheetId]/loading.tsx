import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}
