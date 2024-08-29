"use client";

import { useParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { api } from "~/trpc/react";

type GradeSheetGetGradeProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["grades"]
>[number];

type GradeSheetGetProcedureOutput = NonNullable<
  RouterOutputs["gradeSheet"]["get"]
>;

export function GradeHeader({
  grades,
  gradesheet,
}: {
  grades: GradeSheetGetGradeProcedureOutput[];
  gradesheet: GradeSheetGetProcedureOutput;
}) {
  const params = useParams<{ id: string }>();

  const classroomQuery = api.classroom.get.useQuery(params.id);
  const { t, i18n } = useLocale();
  const maxGrade = Math.max(...grades.map((grade) => grade.grade));
  const minGrade = Math.min(...grades.map((grade) => grade.grade));
  const grades10 = grades.filter((grade) => grade.grade >= 10).length;

  const males10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male",
    ).length / (grades.length || 1e9);

  const females10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female",
    ).length / (grades.length || 1e9);

  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
  const average =
    grades.reduce((acc, grade) => acc + grade.grade, 0) /
    (grades.length || 1e9);

  return (
    <div className="flex flex-col gap-2 border-b">
      <div className="grid px-2 italic md:grid-cols-3">
        <span>
          {classroomQuery.isPending ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            classroomQuery.data?.name
          )}
        </span>
        <span> Note sur : 20.00</span>
        <span> {gradesheet.subject.teacher?.lastName}</span>
        <span>
          {gradesheet.startDate && dateFormatter.format(gradesheet.startDate)}
        </span>
        <span>
          {" "}
          {t("max_grade")} : {maxGrade}
        </span>
        <span> {gradesheet.subject.course?.name} </span>
        <span>{gradesheet.name}</span>
        <span>Effectif : {classroomQuery.data?.size} </span>
        <span>
          {t("min_grade")} : {minGrade}
        </span>
        <span>
          {t("coefficient")} : {gradesheet.subject.coefficient}{" "}
        </span>
        <span>
          {t("avg_grade")} : {average.toFixed(2)}
        </span>
        <span>
          {" "}
          {t("term")} : {gradesheet.term.name}
        </span>
      </div>
      <div className="mx-2 mb-2">
        <Table className="border text-center">
          <TableHeader>
            <TableRow>
              <TableHead
                align="center"
                className="border text-center"
                rowSpan={2}
              >
                {t("number_assessed")}
              </TableHead>
              <TableHead className="border text-center" rowSpan={2}>
                {t("overall_class_average")}
              </TableHead>
              <TableHead className="border text-center" rowSpan={2}>
                {t("number_of_avg_ge_10")}
              </TableHead>
              <TableHead className="border text-center" colSpan={2}>
                {t("success_rate")}
              </TableHead>
              <TableHead className="border text-center" rowSpan={2}>
                {t("overall_success_rate")}
              </TableHead>
              <TableHead className="border text-center" rowSpan={2}>
                {t("observation")}
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="border text-center">{t("males")}</TableHead>
              <TableHead className="text-center">{t("females")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            <TableRow>
              <TableCell className="border">{grades.length}</TableCell>
              <TableCell className="border">{average.toFixed(2)}</TableCell>
              <TableCell className="border">{grades10}</TableCell>
              <TableCell className="border">
                {(males10Rate * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="border">
                {(females10Rate * 100).toFixed(2)} %
              </TableCell>
              <TableCell className="border">
                {((grades10 * 100) / (grades.length || 1e9)).toFixed(2)}%
              </TableCell>
              <TableCell className="border">Passable</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex border-t bg-muted/40 px-2 py-1">
        <div className="ml-auto flex flex-row items-center gap-4">
          <Label>{t("export")}</Label>
          <Button className="h-6 w-6" variant={"ghost"} size={"icon"}>
            <PDFIcon className="h-4 w-4" />
          </Button>
          <Button className="h-6 w-6" variant={"ghost"} size={"icon"}>
            <XMLIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
