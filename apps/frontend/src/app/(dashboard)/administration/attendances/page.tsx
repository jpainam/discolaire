import { AbsenceTable } from "./AbsenceTable";
import { AttendanceChart } from "./AttendanceChart";
import { AttendanceStats } from "./AttendanceStats";
import { ChatterTable } from "./ChatterTable";
import { ConsigneTable } from "./ConsigneTable";

export default async function Page(props: {
  searchParams: Promise<{ category: string }>;
}) {
  const searchParams = await props.searchParams;
  console.log(searchParams.category);
  return (
    <div className="grid md:flex gap-4 flex-col p-4">
      <AttendanceStats />
      <AttendanceChart />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <AbsenceTable />
        <ConsigneTable />
        <ChatterTable />
        <AbsenceTable />
      </div>
    </div>
  );
}
