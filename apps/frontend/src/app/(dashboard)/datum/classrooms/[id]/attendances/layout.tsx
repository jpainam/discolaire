import { AttendanceHeader } from "@/components/classrooms/attendances/AttendanceHeader";

import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col w-full">
      <AttendanceHeader />
      {children}
    </div>
  );
}
