import { Skeleton } from "@repo/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-2 grid grid-cols-2 gap-2">
      {Array.from({ length: 40 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
