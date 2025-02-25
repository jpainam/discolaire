import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-2 pt-[40px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 32 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    </div>
  );
}
