import { AttendanceStatistics } from "~/components/classrooms/attendances/AttendanceStatistics";
import { RecentAttendance } from "~/components/classrooms/attendances/RecentAttendance";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; date?: Date }>;
}) {
  const searchParams = await props.searchParams;

  const { type, date } = searchParams;

  const params = await props.params;

  const { id } = params;
  console.log(id, type, date);

  return (
    <div className="grid w-full lg:grid-cols-3">
      <div className="">
        <AttendanceStatistics />
      </div>
      <RecentAttendance className="" />
      <div className="">Notification sent</div>
    </div>
  );
}
