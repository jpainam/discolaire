import { Separator } from "~/components/ui/separator";
import { AssignmentCategoryHeader } from "./AssignmentCategoryHeader";
import { AssignmentCategoryTable } from "./AssignmentCategoryTable";

export default function Page() {
  return (
    <div className="flex flex-col">
      <AssignmentCategoryHeader />
      <Separator />
      <div className="p-2">
        <AssignmentCategoryTable />
      </div>
    </div>
  );
}
