import { AttendanceChart } from "./AttendanceChart";
import { AttendanceStats } from "./AttendanceStats";

export default async function Page(props: {
  searchParams: Promise<{ category: string }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams.category);
  return (
    <div className="grid md:flex gap-4 flex-col p-4">
      <AttendanceStats />
      <AttendanceChart />
    </div>
  );
}
