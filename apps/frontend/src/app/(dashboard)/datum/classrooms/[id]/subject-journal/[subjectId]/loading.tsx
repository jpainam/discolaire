import { Skeleton } from "@repo/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-2 grid h-full w-full grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-full w-full" />
      ))}
    </div>
  );
}
