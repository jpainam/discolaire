import { SectionHeader } from "./SectionHeader";
import { SectionTable } from "./SectionTable";

export default function Page() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <SectionHeader />
      <SectionTable />
    </div>
  );
}
