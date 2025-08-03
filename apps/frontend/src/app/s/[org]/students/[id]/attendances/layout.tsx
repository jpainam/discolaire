import type { PropsWithChildren } from "react";

import { StudentAttendanceHeader } from "~/components/students/attendances/StudentAttendanceHeader";
import { StudentAttendanceSummary } from "./StudentAttendanceSummary";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2">
      <StudentAttendanceHeader />
      <StudentAttendanceSummary />

      {props.children}
    </div>
  );
}
