import { Skeleton } from "@repo/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid w-full grid-cols-3 gap-2 p-2">
      {Array.from({ length: 30 }).map((_, index) => (
        <Skeleton key={index} className="h-[150px] w-full" />
      ))}
    </div>
  );
}
