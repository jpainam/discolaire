import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  BookText,
  CalendarDays,
  Captions,
  ClipboardList,
  Dock,
  Hash,
  Waves,
} from "lucide-react";

import { getServerTranslations } from "~/app/i18n/server";
import { StudentGradeChart } from "~/components/students/grades/charts/StudentGradeChart";
import { GradeSheetStats } from "./grade-sheet-stats";

type GradeSheetPageProps = {
  params: { id: string; gradeId: number };
  searchParams: {
    color: string;
    name: string;
    reportName: string;
    date: string;
    grade: string;
    gradesheetId: string;
    moy: string;
    max: string;
    min: string;
    coef: string;
    termName: string;
  };
};
export default async function Page(props: GradeSheetPageProps) {
  const searchParams = props.searchParams;
  const params = props.params;
  const { t, i18n } = await getServerTranslations();
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fulldate = dateFormat.format(
    searchParams?.date ? new Date(searchParams?.date) : new Date(),
  );
  return (
    <div
      className="text-md flex flex-col gap-2"
      // style={{
      //   borderTopColor: searchParams.color ?? "lightgray",
      // }}
    >
      <div className="flex flex-row items-center justify-between gap-4 border-b bg-muted/50 px-4">
        {t("subject")}
        <span className="font-bold"> {searchParams?.reportName}</span>
        <Button variant={"ghost"} className="opacity-0"></Button>
      </div>
      <ul className="grid gap-3 px-1">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Captions className="h-4 w-4 stroke-1" /> {t("subject")}
          </span>
          <span> {searchParams?.reportName}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <BookText className="h-4 w-4 stroke-1" /> {t("grade_sheet_name")}
          </span>
          <span>{searchParams?.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <CalendarDays className="h-4 w-4 stroke-1" /> {t("date")}
          </span>
          <span>
            {t("grade_of")} {fulldate}
          </span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3 px-1">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Dock className="h-4 w-4 stroke-1" />
            {t("grade_of_the_student")}
          </span>
          <span>{searchParams?.grade || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ArrowUpLeft className="h-4 w-4 stroke-1" />{" "}
            {t("highest_classroom_grade")}
          </span>
          <span>{searchParams?.max || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ArrowDownLeft className="h-4 w-4 stroke-1" />{" "}
            {t("lowest_classroom_grade")}
          </span>
          <span>{searchParams?.min || "N/A"}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3 px-1">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ClipboardList className="h-4 w-4 stroke-1" />
            {t("period_of_evaluation")}
          </span>
          <span>{searchParams?.termName || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Hash className="h-4 w-4 stroke-1" /> {t("coefficient")}
          </span>
          <span>{searchParams?.coef || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Waves className="h-4 w-4 stroke-1" /> {t("average_of_classroom")}
          </span>
          <span>{searchParams?.moy || "N/A"}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <GradeSheetStats gradeSheetId={Number(searchParams.gradesheetId)} />
      <StudentGradeChart grades={[]} />
    </div>
  );
}
