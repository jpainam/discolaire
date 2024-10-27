import { CreateEditPeridicAttendance } from "~/components/classrooms/attendances/periodic/CreateEditPeriodicAttendance";
import { PeriodicAttendanceTable } from "~/components/classrooms/attendances/periodic/PeriodicAttendanceTable";
import { api } from "~/trpc/server";

export default async function Page(
  props: {
    searchParams: Promise<{ term: number }>;
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
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
