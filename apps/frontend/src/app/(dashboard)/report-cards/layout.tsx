import type { PropsWithChildren } from "react";

import { ReportCardMenu } from "~/components/report-cards/ReportCardMenu";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col pt-[100px]">
      <ReportCardMenu />
      {children}
    </div>
  );
}
