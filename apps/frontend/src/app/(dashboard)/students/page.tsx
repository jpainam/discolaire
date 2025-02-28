import { StudentDataTable } from "~/components/students/StudentDataTable";
import { StudentPageHeader } from "./StudentPageHeader";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <StudentPageHeader />
      <StudentDataTable />
    </div>
  );
}
