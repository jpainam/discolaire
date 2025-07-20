import type { PropsWithChildren } from "react";

import { ReportCardHeader } from "~/components/classrooms/reportcards/ReportCardHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col gap-2">
      <ReportCardHeader />
      {children}
    </div>
  );
}
