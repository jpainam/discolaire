import { AttendanceStudentTable } from "@/components/classrooms/attendances/periodic/AttendanceStudentTable";
import { api } from "@/trpc/server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { term: number };
  params: { id: string };
}) {
  const students = await api.classroom.students(params.id);
  return (
    <div className="py-1 flex flex-col gap-2 px-2">
      <AttendanceStudentTable classroomId={params.id} />
    </div>
  );
}
