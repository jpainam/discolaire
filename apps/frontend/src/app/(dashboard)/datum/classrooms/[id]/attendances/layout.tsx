import type { PropsWithChildren } from "react";

import { AttendanceHeader } from "~/components/classrooms/attendances/AttendanceHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <AttendanceHeader />
      {children}
    </div>
  );
}
