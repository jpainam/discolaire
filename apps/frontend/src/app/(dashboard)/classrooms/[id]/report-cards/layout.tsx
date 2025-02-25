import type { PropsWithChildren } from "react";

import { ReportCardHeader } from "~/components/classrooms/report-cards/ReportCardHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <ReportCardHeader />
      {children}
    </div>
  );
}
