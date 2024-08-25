import { ReportCardHeader } from "@/components/classrooms/report-cards/ReportCardHeader";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <ReportCardHeader />
      {children}
    </div>
  );
}
