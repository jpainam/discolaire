import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8" />
        ))}
      </div>
    </div>
  );
}
