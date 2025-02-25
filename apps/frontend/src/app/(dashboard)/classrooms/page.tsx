import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ClassroomPageHeader } from "./ClassroomPageHeader";

export default function Page() {
  return (
    <div className="flex flex-col">
      <ClassroomPageHeader />
      <ClassroomDataTable />
    </div>
  );
}
