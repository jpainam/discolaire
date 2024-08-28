import { AttendanceStudentTable } from "~/components/classrooms/attendances/periodic/AttendanceStudentTable";
import { api } from "~/trpc/server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { term: number };
  params: { id: string };
}) {
  const students = await api.classroom.students(params.id);
  console.log(students);
  console.log(searchParams);
  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      <AttendanceStudentTable classroomId={params.id} />
    </div>
  );
}
