import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";

export default async function Page({}: {}) {
  //const classrooms = await api.classroom.all();
  return (
    <div className="grid w-full flex-row md:flex">
      <ClassroomDataTable />
      {/* <ClassroomEffectif stats={classrooms || []} /> */}
    </div>
  );
}
