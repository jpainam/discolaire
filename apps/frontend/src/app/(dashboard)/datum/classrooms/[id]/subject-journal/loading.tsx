import { Skeleton } from "@repo/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-[20%_80%]">
      <Skeleton className="h-full w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  );
}
