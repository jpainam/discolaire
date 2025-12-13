import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <Skeleton className="h-screen w-1/3" />
      <Skeleton className="h-screen w-1/3" />
      <Skeleton className="h-screen w-1/3" />
    </div>
  );
}
