import { CycleHeader } from "./CycleHeader";
import { CycleTable } from "./CycleTable";

export default function Page() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <CycleHeader />
      <CycleTable />
    </div>
  );
}
