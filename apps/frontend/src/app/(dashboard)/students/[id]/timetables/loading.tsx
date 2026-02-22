import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-6 gap-2 p-4">
      {Array.from({ length: 42 }).map((_, t) => (
        <Skeleton className="h-8" key={t} />
      ))}
    </div>
  );
}
