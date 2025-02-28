import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ClassroomPageHeader } from "./ClassroomPageHeader";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-2 py-4">
      <ClassroomPageHeader />
      <ClassroomDataTable />
    </div>
  );
}
