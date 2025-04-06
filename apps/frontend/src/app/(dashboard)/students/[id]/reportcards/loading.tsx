import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="py-2 grid grid-cols-6 gap-4 px-4">
      {Array.from({ length: 60 }).map((_, i) => (
        <Skeleton key={i} className="h-12" />
      ))}
    </div>
  );
}
