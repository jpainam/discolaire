import { PeriodicAttendanceHeader } from "@/components/students/attendances/periodic/PeriodicAttendanceHeader";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <PeriodicAttendanceHeader />
      {children}
    </div>
  );
}
