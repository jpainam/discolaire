"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import _, { sum } from "lodash";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import type { FlatBadgeVariant } from "~/components/FlatBadge";
import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import FlatBadge from "~/components/FlatBadge";
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

export function StudentReportCardMontly({
  student,
  term,
  classroom,
  subjects,
}: {
  student: RouterOutputs["student"]["get"];
  term: RouterOutputs["term"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const classroomId = classroom.id;
  const termId = term.id;
  const studentId = student.id;
  const trpc = useTRPC();
  const t = useTranslations();

  const {
    data: { studentsReport, summary, globalRanks },
  } = useSuspenseQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId,
      termId,
    }),
  );

  const { data: disciplines } = useSuspenseQuery(
    trpc.discipline.sequence.queryOptions({
      classroomId,
      termId,
    }),
  );
  const disc = disciplines.get(student.id);

  const groups = _.groupBy(subjects, "subjectGroupId");
  const studentReport = studentsReport.get(studentId);
  const globalRank = globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return null;
  }

  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const rowClassName = "border text-center py-0";

  return (
    <div className="mb-10 flex w-full flex-col gap-2">
      <ReportCardActionHeader
        title={`BULLETIN SCOLAIRE : ${term.name}`}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/?studentId=${studentId}&termId=${termId}`}
      />

      <div className="overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[15px]"></TableHead>
              <TableHead className={cn(rowClassName)}>
                {t("subjects")}
              </TableHead>
              <TableHead className={cn(rowClassName)}>{t("grades")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("Moy C")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("Min/Max")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(groups).map((groupId: string) => {
              const items = groups[Number(groupId)]?.sort(
                (a, b) => a.order - b.order,
              );

              if (!items) return null;
              const group = items[0]?.subjectGroup;
              let coeff = 0;
              return (
                <Fragment key={`fragment-${groupId}`}>
                  {items.map((subject, index) => {
                    const grade = studentReport.studentCourses.find(
                      (c) => c.subjectId === subject.id,
                    );
                    const subjectSummary = summary.get(subject.id);
                    coeff += grade?.grade != null ? subject.coefficient : 0;
                    return (
                      <TableRow key={`${subject.id}-${groupId}-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className={cn(rowClassName, "text-left")}>
                          <div className="flex flex-col">
                            <Link
                              href={`/classrooms/${subject.classroomId}/subjects/${subject.id}`}
                              className="font-semibold hover:underline"
                            >
                              {subject.course.reportName}
                            </Link>
                            <Link
                              href={`/staffs/${subject.teacherId}`}
                              className="ml-4 hover:underline"
                            >
                              {subject.teacher?.prefix}{" "}
                              {subject.teacher?.lastName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          <Cell n={grade?.grade} />
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.grade != null && subject.coefficient}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.total?.toFixed(2)}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.rank}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {subjectSummary?.average.toFixed(2)}
                        </TableCell>
                        {grade?.grade && (
                          <TableCell className={cn(rowClassName)}>
                            {subjectSummary?.min.toFixed(2)} /{" "}
                            {subjectSummary?.max.toFixed(2)}
                          </TableCell>
                        )}
                        <TableCell
                          className={cn("border-y text-left uppercase")}
                        >
                          {getAppreciations(grade?.grade)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow
                    className="bg-secondary text-secondary-foreground"
                    key={`recap-${groupId}`}
                  >
                    <TableCell></TableCell>
                    <TableCell className="" colSpan={2}>
                      {group?.name}
                    </TableCell>
                    <TableCell className={cn(rowClassName)}>{coeff}</TableCell>
                    <TableCell className="text-center text-sm" colSpan={3}>
                      {t("points")}:{" "}
                      {sum(
                        items.map(
                          (subject) =>
                            studentReport.studentCourses.find(
                              (c) => c.subjectId === subject.id,
                            )?.total ?? 0,
                        ),
                      ).toFixed(1)}{" "}
                      /{" "}
                      {sum(
                        items.map((subject) => 20 * subject.coefficient),
                      ).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-sm" colSpan={2}>
                      {t("average")} :{" "}
                      {(
                        sum(
                          items.map(
                            (subject) =>
                              studentReport.studentCourses.find(
                                (c) => c.subjectId === subject.id,
                              )?.total,
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
  );
}

function Cell({ n }: { n?: number | null }) {
  let v: FlatBadgeVariant = "green";

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (n == undefined || n == null) {
    return <></>;
  }
  if (n < 10) {
    v = "red";
  } else if (n < 12) {
    v = "yellow";
  } else if (n < 14) {
    v = "blue";
  }
  return (
    <FlatBadge
      className="w-[50px] justify-center text-center text-xs font-normal"
      variant={v}
    >
      {n.toFixed(2)}
    </FlatBadge>
  );
}
