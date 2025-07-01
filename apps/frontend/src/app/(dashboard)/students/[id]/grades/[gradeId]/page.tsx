import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
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
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

interface GradeSheetPageProps {
  params: Promise<{ id: string; gradeId: number }>;
  searchParams: Promise<{
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
  }>;
}
export default async function Page(props: GradeSheetPageProps) {
  const searchParams = await props.searchParams;

  const { t, i18n } = await getServerTranslations();
  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fulldate = dateFormat.format(
    searchParams.date ? new Date(searchParams.date) : new Date()
  );
  const grades = await caller.gradeSheet.grades(
    Number(searchParams.gradesheetId)
  );
  const evaluated = grades.filter((g) => !g.isAbsent);
  const len = evaluated.length;
  const maleCount = evaluated.filter((g) => g.student.gender === "male").length;
  const femaleCount = evaluated.filter(
    (g) => g.student.gender === "female"
  ).length;
  const maleAbove10 = evaluated.filter(
    (g) => g.grade >= 10 && g.student.gender === "male"
  ).length;
  const femaleAbove10 = evaluated.filter(
    (g) => g.grade >= 10 && g.student.gender === "female"
  ).length;
  const above10 = evaluated.filter((g) => g.grade >= 10).length;
  return (
    <div
      className="text-md flex flex-col gap-2"
      // style={{
      //   borderTopColor: searchParams.color ?? "lightgray",
      // }}
    >
      <div className="flex flex-row items-center justify-between gap-4 border-b bg-muted/50 px-4 py-3">
        {t("subject")}
        <span className="font-bold"> {searchParams.reportName}</span>
        {/* <Button variant={"ghost"} className="opacity-0"></Button> */}
      </div>
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Captions className="h-4 w-4 stroke-1" /> {t("subject")}
          </span>
          <span> {searchParams.reportName}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <BookText className="h-4 w-4 stroke-1" /> {t("grade_sheet_name")}
          </span>
          <span>{searchParams.name}</span>
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
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Dock className="h-4 w-4 stroke-1" />
            {t("grade_of_the_student")}
          </span>
          <span>{searchParams.grade || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ArrowUpLeft className="h-4 w-4 stroke-1" />{" "}
            {t("highest_classroom_grade")}
          </span>
          <span>{searchParams.max || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ArrowDownLeft className="h-4 w-4 stroke-1" />{" "}
            {t("lowest_classroom_grade")}
          </span>
          <span>{searchParams.min || "N/A"}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <ClipboardList className="h-4 w-4 stroke-1" />
            {t("period_of_evaluation")}
          </span>
          <span>{searchParams.termName || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Hash className="h-4 w-4 stroke-1" /> {t("coefficient")}
          </span>
          <span>{searchParams.coef || "N/A"}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-muted-foreground">
            <Waves className="h-4 w-4 stroke-1" /> {t("average_of_classroom")}
          </span>
          <span>{searchParams.moy || "N/A"}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 px-4 md:grid-cols-3 gap-4">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>
              {t("males")} {">=10"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {((maleAbove10 * 100) / (maleCount || 1e-9)).toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {t("out_of_participants", {
                n1: maleAbove10,
                n2: maleCount,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <CardTitle>
              {t("females")} {">=10"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-pink-600">
              {((femaleAbove10 * 100) / (femaleCount || 1e-9)).toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {t("out_of_participants", {
                n1: femaleAbove10,
                n2: femaleCount,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <CardTitle>{t("success_rate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {((above10 * 100) / (len || 1e-9)).toFixed(2)}%
            </div>
            <p className="text-sm text-muted-foreground">
              {t("out_of_participants", {
                n1: above10,
                n2: len,
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <StudentGradeChart grades={[]} /> */}
    </div>
  );
}
