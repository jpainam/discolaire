import { Skeleton } from "@repo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 py-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  );
}
