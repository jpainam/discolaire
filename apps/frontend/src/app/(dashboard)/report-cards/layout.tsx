import type { PropsWithChildren } from "react";

import { ReportCardMenu } from "~/components/reportcards/ReportCardMenu";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col ">
      <ReportCardMenu />
      {children}
    </div>
  );
}
