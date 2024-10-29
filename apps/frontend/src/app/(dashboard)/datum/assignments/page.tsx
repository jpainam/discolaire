import { AssignmentSummary } from "./AssignmentSummary";
import { AssignmentTable } from "./AssignmentTable";

export default function Page() {
  return (
    <div className="py-2">
      <AssignmentSummary />

      <AssignmentTable />
    </div>
  );
}
