import { AttendanceChart } from "./AttendanceChart";
import { AttendanceStats } from "./AttendanceStats";

export default async function Page(props: {
  searchParams: Promise<{ category: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="grid flex-col gap-4 p-4 md:flex">
      <AttendanceStats />
      <AttendanceChart />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        A large table of attendance DATABASE
      </div>
    </div>
  );
}
