"use client";

import { useLocale } from "@/hooks/use-locale";
import { StudentReportBlock } from "./StudentReportBlock";

export function StudentLinkReports({ reports }: { reports: any[] }) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {reports.map((report) => {
        return <StudentReportBlock key={report.id} item={report} />;
      })}
    </div>
  );
}
