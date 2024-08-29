"use client";

import { useAtom } from "jotai";

import { useLocale } from "@repo/i18n";
import { Checkbox } from "@repo/ui/checkbox";
import { Label } from "@repo/ui/label";

import type { Report } from "~/types/report";
import { studentReportsAtom } from "~/atoms/report-atom";
import { cn } from "~/lib/utils";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";

export function StudentReportBlock({ item }: { item: Report }) {
  const [studentReport, setStudentReport] = useAtom(studentReportsAtom);
  const { t } = useLocale("print");
  const link = `${item.link}/?type=${item.type}`;

  return (
    <div
      key={item.id.toString()}
      className={cn(
        "flex flex-row items-center gap-2",
        !studentReport.includes(link) && "text-muted-foreground",
      )}
    >
      <Checkbox
        checked={studentReport.includes(link)}
        onCheckedChange={(checked) => {
          if (checked) {
            setStudentReport([...studentReport, link]);
          } else {
            setStudentReport(studentReport.filter((report) => report !== link));
          }
        }}
        id={item.id.toString()}
      />
      <Label htmlFor={item.id.toString()} className="flex items-center">
        {t(item.name)}
      </Label>
      {item.type === "pdf" && <PDFIcon className="h-4 w-4" />}
      {item.type === "excel" && <XMLIcon className="h-4 w-4" />}
    </div>
  );
}
