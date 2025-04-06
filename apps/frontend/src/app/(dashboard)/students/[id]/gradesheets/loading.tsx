import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
