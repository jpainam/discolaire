import { AttendanceHeader } from "~/components/students/attendances/AttendanceHeader";
import AttendanceTable from "~/components/students/attendances/AttendanceTable";

export default function Page() {
  return (
    <div className="flex flex-col">
      <AttendanceHeader />
      <AttendanceTable />
    </div>
  );
}
