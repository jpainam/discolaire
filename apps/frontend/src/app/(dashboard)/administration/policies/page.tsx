import { PolicyDataTable } from "@/components/administration/policies/PolicyDataTable";
import { PolicyHeader } from "@/components/administration/policies/PolicyHeader";

export default function Page() {
  return (
    <div className="flex flex-col">
      <PolicyHeader />
      <PolicyDataTable />
    </div>
  );
}
