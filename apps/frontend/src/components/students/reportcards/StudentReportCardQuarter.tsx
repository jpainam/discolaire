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

export function StudentReportCardQuarter({
  student,
  classroom,
  subjects,
  term,
}: {
  student: RouterOutputs["student"]["get"];
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
  term: RouterOutputs["term"]["get"];
}) {
  const t = useTranslations();
  const termId = term.id;
  const classroomId = classroom.id;
  const studentId = student.id;

  const trpc = useTRPC();
  const { title, seq1, seq2 } = getTitle({ trimestreId: term.id });

  const {
    data: { studentsReport, summary, globalRanks },
  } = useSuspenseQuery(
    trpc.reportCard.getTrimestre.queryOptions({
      classroomId,
      termId,
    }),
  );

  const { data: disciplines } = useSuspenseQuery(
    trpc.discipline.trimestre.queryOptions({
      classroomId,
      termId,
    }),
  );

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
  const rowClassName = "border text-center py-0";
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;

  const disc = disciplines.get(studentId);

  return (
    <div className="flex flex-col gap-2">
      <ReportCardActionHeader
        title={title}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/trimestres/?studentId=${studentId}&trimestreId=${termId}`}
      />
      <div>
        <div className="bg-background overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={cn(rowClassName, "text-left")}>
                  {t("subject")}
                </TableHead>
                <TableHead className={cn(rowClassName)}>{seq1}</TableHead>
                <TableHead className={cn(rowClassName)}>{seq2}</TableHead>
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
                              <Link
                                href={`/classrooms/${subject.id}/subjects/${subject.id}`}
                                className="font-semibold hover:underline"
                              >
                                {subject.course.reportName}
                              </Link>
                              <Link
                                href={`/staffs/${subject.teacher?.id}`}
                                className="ml-4 hover:underline"
                              >
                                {subject.teacher?.prefix}{" "}
                                {subject.teacher?.lastName}
                              </Link>
                            </div>
                            {/* {subject.course.reportName} */}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.grade1} />
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.grade2} />
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.average} />
                          </TableCell>
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
                        colSpan={4}
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

function getTitle({ trimestreId }: { trimestreId: string }) {
  if (trimestreId.includes("1")) {
    return {
      title: "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE",
      seq1: "SEQ1",
      seq2: "SEQ2",
    };
  }
  if (trimestreId.includes("2")) {
    return {
      title: "BULLETIN SCOLAIRE DU SECOND TRIMESTRE",
      seq1: "SEQ3",
      seq2: "SEQ4",
    };
  }
  return {
    title: "BULLETIN SCOLAIRE DU TROISIEME TRIMESTRE",
    seq1: "SEQ5",
    seq2: "SEQ6",
  };
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
