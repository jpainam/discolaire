"use client";

import { StudentReportBlock } from "./StudentReportBlock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StudentLinkReports({ reports }: { reports: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {reports.map((report) => {
        return <StudentReportBlock key={report.id} item={report} />;
      })}
    </div>
  );
}
