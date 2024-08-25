import { SkeletonLineGroup } from "@/components/skeletons/data-table";
import rangeMap from "@/lib/range-map";

export default function LoadingDashboard() {
  return (
    <div className="flex flex-col p-4 gap-8">
      {rangeMap(15, (i) => (
        <div key={i} className="grid xx-4">
          <SkeletonLineGroup
            className="grid grid-cols-6 gap-4"
            skeletonClassName="h-8 w-full"
            columns={6}
          />
        </div>
      ))}
    </div>
  );
}
