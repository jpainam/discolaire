"use client";

import { useMemo } from "react";
import Link from "next/link";
//import { ReportCardTable } from "~/components/classrooms/reportcards/ReportCardTable2";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { AvatarState } from "~/components/AvatarState";
import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ReportCardTerm({
  termId,
  classroom,
  subjects,
  students,
}: {
  termId: string;
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];
}) {
  const trpc = useTRPC();
  const {
    data: { studentsReport, summary: _summary, globalRanks },
  } = useSuspenseQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId: classroom.id,
      termId,
    }),
  );
  const { data: term } = useSuspenseQuery(trpc.term.get.queryOptions(termId));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { studentsMap, averages, successCount, successRate, average } =
    useMemo(() => {
      const studentsMap = new Map(students.map((s) => [s.id, s]));

      const values = Array.from(globalRanks.values());
      const averages = values.map((g) => g.average);

      const successCount = averages.filter((val) => val >= 10).length;

      const total = averages.reduce((acc, val) => acc + val, 0);
      const count = averages.length;

      const successRate = count === 0 ? 0 : successCount / count;
      const average = count === 0 ? 0 : total / count;

      return {
        studentsMap,
        averages,
        successCount,
        successRate,
        average,
      };
    }, [students, globalRanks]);

  const t = useTranslations();

  return (
    <div className="mb-10 flex w-full flex-col gap-2 text-sm">
      <ReportCardActionHeader
        title={`BULLETIN SCOLAIRE : ${term.name}`}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw?classroomId=${classroom.id}&termId=${termId}`}
      />

      <div>
        <div className="bg-background overflow-hidden">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center" colSpan={3}>
                  {t("fullName")}
                </TableHead>
                <TableHead className="text-center">{t("avg")}</TableHead>
                <TableHead className="text-center">{t("rank")}</TableHead>
                {subjects
                  .sort((a, b) => a.order - b.order)
                  .map((subject, index) => {
                    return (
                      <TableHead
                        className="text-center"
                        // colSpan={2}
                        key={`${index}${subject.id}`}
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            {subject.course.reportName.slice(0, 4)}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{subject.course.reportName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                    );
                  })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from(globalRanks).map(([key, value], index) => {
                const studentReport = studentsReport.get(key);
                const student = studentsMap.get(key);
                if (!studentReport || !student) {
                  return null;
                }
                return (
                  <TableRow className="bg-transparent" key={student.id}>
                    <TableCell className="w-[10px]">
                      <AvatarState
                        className="h-8 w-8"
                        avatar={student.user?.avatar}
                        pos={index}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        className="hover:underline"
                        href={`/students/${student.id}/reportcards?termId=${termId}`}
                      >
                        {student.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="border text-center">
                      {student.gender == "female" ? "F" : "M"}
                    </TableCell>
                    <TableCell className="border text-center">
                      {value.average.toFixed(2)}
                    </TableCell>
                    <TableCell className="border text-center">
                      {value.rank}
                    </TableCell>
                    {subjects
                      .sort((a, b) => a.order - b.order)
                      .map((subject, index) => {
                        const g = studentReport.studentCourses.find(
                          (c) => c.subjectId === subject.id,
                        )?.average;
                        return (
                          <TableCell
                            key={`grade-${index}${subject.id}`}
                            className={cn(
                              "border-l text-center",
                              (g ?? 0) < 10
                                ? "!bg-red-50 dark:!bg-red-800"
                                : (g ?? 0) < 15
                                  ? "!bg-yellow-50 dark:!bg-yellow-800"
                                  : "!bg-green-50 dark:!bg-green-800",
                            )}
                          >
                            {g ? g.toFixed(2) : "-"}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <BottomSummary averages={averages} successRate={successRate} />
      </div>
    </div>
  );
}

function BottomSummary({
  averages,
  successRate,
}: {
  averages: number[];
  successRate: number;
}) {
  const avg = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const t = useTranslations();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Min.Avg</TableHead>
          <TableHead>Max.Avg</TableHead>
          <TableHead>{t("average")}</TableHead>
          <TableHead>{t("success_rate")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            {isFinite(Math.min(...averages))
              ? Math.min(...averages).toFixed(2)
              : "-"}
          </TableCell>
          <TableCell>
            {isFinite(Math.max(...averages))
              ? Math.max(...averages).toFixed(2)
              : "-"}
          </TableCell>
          <TableCell>{isFinite(avg) ? avg.toFixed(2) : "-"}</TableCell>
          <TableCell>
            {isFinite(successRate) ? (successRate * 100).toFixed(2) + "%" : "-"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
