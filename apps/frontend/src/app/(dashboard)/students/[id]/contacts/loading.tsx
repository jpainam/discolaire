import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-2 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-8" />
      ))}
    </div>
  );
}
