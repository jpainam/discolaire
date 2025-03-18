import { DrugHeader } from "./DrugHeader";
import { DrugTable } from "./DrugTable";

export default function Page() {
  return (
    <div className="flex flex-col">
      <DrugHeader />
      <DrugTable />
    </div>
  );
}
