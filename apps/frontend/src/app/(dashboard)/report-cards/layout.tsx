import { ReportCardMenu } from "@/components/report-cards/ReportCardMenu";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <ReportCardMenu />
      {children}
    </div>
  );
}
