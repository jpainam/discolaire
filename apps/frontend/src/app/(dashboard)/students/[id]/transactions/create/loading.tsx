import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full grid grid-cols-2 gap-4 py-4 max-w-3xl">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  );
}
