import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
import { PolicyTable } from "~/components/administration/policies/PolicyTable";

export default function Page() {
  return (
    <div className="flex flex-col">
      <PolicyHeader />
      <PolicyTable />
    </div>
  );
}
