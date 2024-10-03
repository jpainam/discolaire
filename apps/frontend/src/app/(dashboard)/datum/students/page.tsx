import { StudentDataTable } from "~/components/students/StudentDataTable";
import { StudentPageHeader } from "./StudentPageHeader";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 pt-[10px]">
      <StudentPageHeader />
      <StudentDataTable />
    </div>
  );
}
