import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ClassroomPageHeader } from "./ClassroomPageHeader";

export default function Page() {
  return (
    <>
      <ClassroomPageHeader />
      <ClassroomDataTable />
    </>
  );
}
