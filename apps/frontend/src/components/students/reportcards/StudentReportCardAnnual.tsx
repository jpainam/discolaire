"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import _, { sum } from "lodash";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { ReportCardDiscipline } from "~/components/students/reportcards/ReportCardDiscipline";
import { ReportCardMention } from "~/components/students/reportcards/ReportCardMention";
import { ReportCardPerformance } from "~/components/students/reportcards/ReportCardPerformance";
import { ReportCardSummary } from "~/components/students/reportcards/ReportCardSummary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/appreciations";

export function StudentReportCardAnnual({
  classroom,
  term,
  student,
  subjects,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
  term: RouterOutputs["term"]["get"];
  student: RouterOutputs["student"]["get"];
}) {
  const studentId = student.id;
  const classroomId = classroom.id;
  const termId = term.id;

  const t = useTranslations();
  const trpc = useTRPC();

  const {
    data: { studentsReport, summary, globalRanks },
  } = useSuspenseQuery(
    trpc.reportCard.getAnnualReport.queryOptions({
      classroomId,
      termId,
    }),
  );

  const { successRate, average, averages } = useMemo(() => {
    const values = Array.from(globalRanks.values());
    const averages = values.map((g) => g.average);
    const successCount = averages.filter((val) => val >= 10).length;
    const successRate = successCount / averages.length;

    const average =
      averages.reduce((acc, val) => acc + val, 0) / averages.length;
    return { successRate, average, averages };
  }, [globalRanks]);

  const rowClassName = "border text-center py-0";
  const { data: disciplines, isPending: isPendingDiscipline } = useQuery(
    trpc.discipline.annual.queryOptions({
      classroomId,
    }),
  );

  const groups = _.groupBy(subjects, "subjectGroupId");
  const studentReport = studentsReport.get(studentId);
  const globalRank = globalRanks.get(studentId);

  if (isPendingDiscipline) {
    return <TableSkeleton rows={4} />;
  }

  if (!studentReport || !globalRank) {
    return <></>;
  }
  const disc = disciplines?.get(studentId);

  return (
    <div className="flex flex-col gap-2">
      <ReportCardActionHeader
        title={"BULLETIN ANNUEL"}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/annual?studentId=${studentId}&classroomId=${classroomId}&termId=${termId}`}
      />
      <div className="px-4">
        <div className="bg-background overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={cn(rowClassName, "text-left")}>
                  {t("subject")}
                </TableHead>
                <TableHead className={cn(rowClassName)}>SEQ1</TableHead>
                <TableHead className={cn(rowClassName)}>SEQ2</TableHead>
                <TableHead className={cn(rowClassName)}>SEQ3</TableHead>
                <TableHead className={cn(rowClassName)}>SEQ4</TableHead>
                <TableHead className={cn(rowClassName)}>SEQ5</TableHead>
                <TableHead className={cn(rowClassName)}>SEQ6</TableHead>
                <TableHead className={cn(rowClassName)}>{t("Moy")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("Moy C")}</TableHead>
                <TableHead className={cn(rowClassName)}>
                  {t("Min/Max")}
                </TableHead>
                <TableHead className={cn(rowClassName)}>
                  {t("appreciation")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groups).map((groupId: string) => {
                const items = groups[Number(groupId)]?.sort(
                  (a, b) => a.order - b.order,
                );

                if (!items) return null;
                const group = items[0];
                let coeff = 0;
                return (
                  <Fragment key={`fragment-${groupId}`}>
                    {items.map((subject, index) => {
                      const grade = studentReport.studentCourses.find(
                        (c) => c.subjectId === subject.id,
                      );
                      const subjectSummary = summary.get(subject.id);
                      coeff += grade?.average != null ? subject.coefficient : 0;
                      return (
                        <TableRow key={`${subject.id}-${groupId}-${index}`}>
                          <TableCell className={cn(rowClassName, "text-left")}>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {subject.course.reportName}
                              </span>
                              <Link
                                href={`/staffs/${subject.teacher?.id}`}
                                className="ml-4 hover:text-blue-500 hover:underline"
                              >
                                {subject.teacher?.prefix}{" "}
                                {subject.teacher?.lastName}
                              </Link>
                            </div>
                          </TableCell>
                          {grade?.grades.map((g, i) => {
                            return (
                              <TableCell
                                className={cn(rowClassName)}
                                key={`g-${i}-${subject.id}-${groupId}`}
                              >
                                {g?.toFixed(2)}
                              </TableCell>
                            );
                          })}
                          {grade == null && <TableCell colSpan={6}></TableCell>}

                          {grade && grade.average !== null ? (
                            <TableCell
                              className={cn(
                                "border-l text-center",
                                grade.average < 10
                                  ? "!bg-red-100 dark:!bg-red-900"
                                  : grade.average < 15
                                    ? "!bg-yellow-100 dark:!bg-yellow-900"
                                    : "!bg-green-100 dark:!bg-green-900",
                              )}
                            >
                              {grade.average.toFixed(2)}
                            </TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )}
                          <TableCell
                            className={cn("text-center", rowClassName)}
                          >
                            {grade?.average && grade.coeff}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {grade?.total?.toFixed(2)}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {grade?.rank}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {subjectSummary?.average.toFixed(2)}
                          </TableCell>
                          {grade?.average && (
                            <TableCell className={rowClassName}>
                              {subjectSummary?.min.toFixed(2)} /{" "}
                              {subjectSummary?.max.toFixed(2)}
                            </TableCell>
                          )}
                          <TableCell className={cn("uppercase", rowClassName)}>
                            {getAppreciations(subjectSummary?.average)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow
                      className="bg-secondary text-secondary-foreground border"
                      key={`recap-${groupId}`}
                    >
                      <TableCell
                        className={cn(rowClassName, "text-left")}
                        colSpan={8}
                      >
                        {group?.subjectGroup?.name}
                      </TableCell>
                      <TableCell className={cn(rowClassName)}>
                        {coeff}
                      </TableCell>
                      <TableCell className={cn(rowClassName)} colSpan={3}>
                        {t("points")} :{" "}
                        {sum(
                          items.map(
                            (subject) =>
                              (studentReport.studentCourses.find(
                                (c) => subject.id === c.subjectId,
                              )?.average ?? 0) * subject.coefficient,
                          ),
                        ).toFixed(1)}{" "}
                        / {sum(items.map((c) => 20 * c.coefficient)).toFixed(1)}
                      </TableCell>
                      <TableCell
                        className={cn(rowClassName, "py-2")}
                        colSpan={2}
                      >
                        {t("average")} :{" "}
                        {(
                          sum(
                            items.map(
                              (subject) =>
                                (studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id,
                                )?.average ?? 0) * subject.coefficient,
                            ),
                          ) / (coeff || 1)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-row items-start gap-2 py-2">
          <ReportCardMention average={globalRank.average} id={studentId} />
          <ReportCardDiscipline
            absence={disc?.absence ?? 0}
            lateness={disc?.late ?? 0}
            justifiedLateness={disc?.justifiedLate ?? 0}
            consigne={disc?.consigne ?? 0}
            justifiedAbsence={disc?.justifiedAbsence ?? 0}
            id={studentId}
          />
          <ReportCardPerformance
            successRate={successRate}
            max={Math.max(...averages)}
            min={Math.min(...averages)}
            avg={average}
          />
          <ReportCardSummary
            id={studentId}
            classroom={classroom}
            rank={globalRank.rank}
            average={globalRank.average}
          />
        </div>
      </div>
    </div>
  );
}
