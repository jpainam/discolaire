import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton className="" key={i} />
      ))}
    </div>
  );
}
