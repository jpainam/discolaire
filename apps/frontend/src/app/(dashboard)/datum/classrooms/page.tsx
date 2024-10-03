import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ClassroomPageHeader } from "./ClassroomPageHeader";

export default function Page() {
  return (
    <div className="flex flex-col pt-[10px]">
      <ClassroomPageHeader />
      <ClassroomDataTable />
    </div>
  );
}
