import { ClassroomDataTable } from "@/components/classrooms/ClassroomDataTable";

export default async function Page({}: {}) {
  //const classrooms = await api.classroom.all();
  return (
    <div className="grid md:flex flex-row w-full">
      <ClassroomDataTable />
      {/* <ClassroomEffectif stats={classrooms || []} /> */}
    </div>
  );
}
