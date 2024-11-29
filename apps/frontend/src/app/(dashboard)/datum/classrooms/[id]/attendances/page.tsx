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
    <div className="grid w-full gap-4 p-2 md:grid-cols-2 lg:grid-cols-3">
      <RecentAttendance className="" />
      <RecentAttendance className="" />
      <RecentAttendance className="" />
    </div>
  );
}
