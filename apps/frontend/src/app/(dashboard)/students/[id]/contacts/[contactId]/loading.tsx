import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-4 px-2 pb-2 md:grid-cols-2">
      {Array.from({ length: 32 }).map((_, index) => (
        <Skeleton key={index} className="h-8" />
      ))}
    </div>
  );
}
