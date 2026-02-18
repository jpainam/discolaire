import { TableSkeleton } from "~/components/skeletons/table-skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 p-4">
      <TableSkeleton rows={8} cols={3} />
    </div>
  );
}
