import { TableSkeleton } from "~/components/skeletons/table-skeleton";

export default function Loading() {
  return <TableSkeleton rows={20} cols={8} />;
}
