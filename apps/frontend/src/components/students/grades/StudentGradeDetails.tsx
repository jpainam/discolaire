"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

export function StudentGradeDetails({
  gradeId,
  gradesheetId,
}: {
  gradeId: number;
  gradesheetId: number;
}) {
  const trpc = useTRPC();
  const { data: grade, isPending: gradeIsPending } = useQuery(
    trpc.grade.get.queryOptions(gradeId),
  );
  const { data: gradeSheet, isPending: gradeSheetIsPending } = useQuery(
    trpc.gradeSheet.get.queryOptions(gradesheetId),
  );

  const {
    maleCount,
    femaleCount,
    maleAbove10,
    femaleAbove10,
    above10,
    len,
    max,
    min,
    avg,
  } = useMemo(() => {
    const evaluated = gradeSheet?.grades.filter((g) => !g.isAbsent) ?? [];
    const grades = evaluated.map((g) => g.grade);
    const maleCount = evaluated.filter(
      (g) => g.student.gender === "male",
    ).length;
    const femaleCount = evaluated.filter(
      (g) => g.student.gender === "female",
    ).length;
    const maleAbove10 = evaluated.filter(
      (g) => g.grade >= 10 && g.student.gender === "male",
    ).length;
    const femaleAbove10 = evaluated.filter(
      (g) => g.grade >= 10 && g.student.gender === "female",
    ).length;
    const above10 = evaluated.filter((g) => g.grade >= 10).length;
    return {
      maleCount,
      femaleCount,
      maleAbove10,
      femaleAbove10,
      above10,
      len: evaluated.length,
      max: Math.max(...grades),
      min: Math.min(...grades),
      avg:
        grades.length == 0
          ? 0
          : grades.reduce((a, b) => a + b, 0) / grades.length,
    };
  }, [gradeSheet]);

  const t = useTranslations();
  const locale = useLocale();
  if (gradeIsPending || gradeSheetIsPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton className="h-8" key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-md flex flex-col gap-2">
      <div className="bg-muted/50 flex flex-row items-center justify-between gap-4 border-b px-4 py-3">
        {t("subject")}
        <span className="font-bold">
          {grade?.gradeSheet.subject.course.reportName}
        </span>
      </div>
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <Captions className="h-4 w-4 stroke-1" /> {t("subject")}
          </span>
          <span> {grade?.gradeSheet.subject.course.reportName}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <BookText className="h-4 w-4 stroke-1" /> {t("grade_sheet_name")}
          </span>
          <span>{grade?.gradeSheet.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <CalendarDays className="h-4 w-4 stroke-1" /> {t("date")}
          </span>
          <span>
            {t("grade_of")}
            {gradeSheet?.createdAt.toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <Dock className="h-4 w-4 stroke-1" />
            {t("grade_of_the_student")}
          </span>
          <span>{grade?.grade}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <ArrowUpLeft className="h-4 w-4 stroke-1" />{" "}
            {t("highest_classroom_grade")}
          </span>
          <span>{max.toFixed(2)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <ArrowDownLeft className="h-4 w-4 stroke-1" />{" "}
            {t("lowest_classroom_grade")}
          </span>
          <span>{min.toFixed(2)}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <ul className="grid gap-3 px-4">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <ClipboardList className="h-4 w-4 stroke-1" />
            {t("period_of_evaluation")}
          </span>
          <span>{gradeSheet?.term.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <Hash className="h-4 w-4 stroke-1" /> {t("coefficient")}
          </span>
          <span>{gradeSheet?.subject.coefficient}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground flex flex-row items-center gap-1">
            <Waves className="h-4 w-4 stroke-1" /> {t("average_of_classroom")}
          </span>
          <span>{avg.toFixed(2)}</span>
        </li>
      </ul>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>
              {t("males")} {">=10"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {maleCount == 0
                ? 0
                : ((maleAbove10 * 100.0) / maleCount).toFixed(2)}
              %
            </div>
            <p className="text-muted-foreground text-sm">
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
              {femaleCount == 0
                ? 0
                : ((femaleAbove10 * 100.0) / femaleCount).toFixed(2)}
              %
            </div>
            <p className="text-muted-foreground text-sm">
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
              {len == 0 ? 0 : ((above10 * 100.0) / len).toFixed(2)}%
            </div>
            <p className="text-muted-foreground text-sm">
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
