import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <HealthVisitHeader />
      <HealthVisitTable className="mx-2" />
    </div>
  );
}
