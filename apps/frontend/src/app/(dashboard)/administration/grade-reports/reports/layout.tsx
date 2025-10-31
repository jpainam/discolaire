import type { PropsWithChildren } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { GradeReportHeader } from "./GradeReportHeader";

export default async function Layout(props: PropsWithChildren) {
  const reportTypes = [
    { id: "001", label: "Roll of Honor" },
    { id: "002", label: "Grade report card" },
    { id: "003", label: "Statistics by course" },
    { id: "004", label: "Summary of results" },
  ];
  const t = await getTranslations();
  return (
    <div className="bg-muted/30 flex flex-col gap-2 rounded-md border p-2">
      <div className="flex flex-row gap-2">
        <div className="text-muted-foreground flex flex-col gap-4 border p-2">
          {reportTypes.map((report, index) => {
            return (
              <Link
                className="border-b text-sm hover:text-blue-600 hover:underline"
                key={`${report.id}-${index}`}
                href={`/administration/grade-reports/reports/${report.id}`}
              >
                {t(report.label)}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <GradeReportHeader />
          {props.children}
        </div>
      </div>
    </div>
  );
}
