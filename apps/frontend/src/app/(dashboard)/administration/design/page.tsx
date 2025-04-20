import { CardStats } from "~/components/administration/CardStats";
import { BusinessMetrics } from "./business-metrics";

export default function Page() {
  return (
    <div className="grid p-4 gap-4">
      <CardStats />
      <BusinessMetrics />
    </div>
  );
}
