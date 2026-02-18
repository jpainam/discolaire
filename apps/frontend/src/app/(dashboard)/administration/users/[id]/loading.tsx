import { TableSkeleton } from "~/components/skeletons/table-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <TableSkeleton rows={10} cols={8} />
    </div>
  );
}
