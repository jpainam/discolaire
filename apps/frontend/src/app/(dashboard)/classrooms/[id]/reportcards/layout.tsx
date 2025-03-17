import type { PropsWithChildren } from "react";

import { ReportCardHeader } from "~/components/classrooms/reportcards/ReportCardHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex gap-2 w-full flex-col">
      <ReportCardHeader />
      {children}
    </div>
  );
}
