import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const classrooms = await api.classroom.all();
  return <ClassroomDataTable classrooms={classrooms} />;
}
