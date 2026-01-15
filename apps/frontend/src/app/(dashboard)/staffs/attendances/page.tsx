import { CreateStaffAttendance } from "./CreateStaffAttendance";
import { StaffAttendanceTable } from "./StaffAttendanceTable";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <CreateStaffAttendance />
      <StaffAttendanceTable />
    </div>
  );
}
