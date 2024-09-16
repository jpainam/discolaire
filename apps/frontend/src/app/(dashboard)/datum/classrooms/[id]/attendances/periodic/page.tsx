import { CreateEditPeridicAttendance } from "~/components/classrooms/attendances/periodic/CreateEditPeriodicAttendance";
import { PeriodicAttendanceTable } from "~/components/classrooms/attendances/periodic/PeriodicAttendanceTable";
import { api } from "~/trpc/server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { term: number };
  params: { id: string };
}) {
  const students = await api.classroom.students(params.id);

  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      {!searchParams.term ? (
        <PeriodicAttendanceTable />
      ) : (
        <CreateEditPeridicAttendance students={students} />
      )}
    </div>
  );
}
