import type { PropsWithChildren } from "react";

import { PeriodicAttendanceHeader } from "~/components/students/attendances/periodic/PeriodicAttendanceHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <PeriodicAttendanceHeader />
      {children}
    </div>
  );
}
