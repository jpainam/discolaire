import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export function TableSkeleton({
  rows,
  cols,
  className,
}: {
  rows: number;
  cols?: number;
  className?: string;
}) {
  const ncol = cols ?? 4;
  return (
    <div
      className={cn(
        `grid gap-4 p-4 md:grid-cols-${Math.floor(ncol / 2)} lg:grid-cols-${ncol}`,
        className,
      )}
    >
      {Array.from({ length: rows * ncol }).map((_, t) => (
        <Skeleton className="h-8" key={t} />
      ))}
    </div>
  );
}
