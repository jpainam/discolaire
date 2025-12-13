import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-4 px-4 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-20" />
        </div>
      ))}
    </div>
  );
}
