import { Fragment, Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";
import _ from "lodash";
import { getTranslations } from "next-intl/server";

import type { RouterOutputs } from "@repo/api";

import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
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
import { UserLink } from "~/components/UserLink";
import { cn } from "~/lib/utils";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";
import { RecpordCardQuarterAlert } from "./RecpordCardQuarterAlert";

export async function ReportCardQuarter({
  classroomId,
  term,
}: {
  classroomId: string;
  term: RouterOutputs["term"]["get"];
}) {
  const t = await getTranslations();
  const queryClient = getQueryClient();
  const classroom = await queryClient.fetchQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );

  const { title } = getTitle({ trimestreId: term.id });

  const {
    studentsReport,
    summary: _summary,
    globalRanks,
  } = await caller.reportCard.getTrimestre({
    classroomId,
    termId: term.id,
  });

  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );
  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const groups = _.groupBy(subjects, "subjectGroupId");

  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;

  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const canCreateGradesheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );
  const trimestreId = term.id;
  const seq1 = term.parts[0]?.child.shortName;
  const seq2 = term.parts[1]?.child.shortName;

  return (
    <div className="mb-10 flex flex-col gap-2">
      <ReportCardActionHeader
        title={title}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${term.id}&classroomId=${classroom.id}&format=pdf`}
      />

      <Separator />
      {canCreateGradesheet && (
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="px-4">
                <Skeleton className="h-10 w-full" />
              </div>
            }
          >
            <RecpordCardQuarterAlert
              trimestreId={trimestreId}
              classroomId={classroomId}
            />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="">
        <div className="bg-background overflow-hidden">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center" colSpan={2}>
                  {t("fullName")}
                </TableHead>

                <TableHead className="text-center">{t("avg")}</TableHead>
                <TableHead className="text-center">{t("rank")}</TableHead>
                <TableHead className="text-center">{t("seq")}</TableHead>
                <TableHead className="text-center">{t("avg")}</TableHead>
                {subjects.map((subject, index) => {
                  return (
                    <TableHead
                      className="text-center"
                      key={`${index}${subject.id}`}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            className="hover:underline"
                            href={`/classrooms/${subject.classroomId}/subjects/${subject.id}`}
                          >
                            {subject.course.reportName.slice(0, 4)}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{subject.course.name}</p>
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
                  <Fragment key={`globalrank-${key}-${index}`}>
                    <TableRow key={`globalrank-${key}-${index}`}>
                      <TableCell rowSpan={2}>
                        <UserLink
                          profile="student"
                          avatar={student.user?.avatar}
                          name={getFullName(student)}
                          id={student.id}
                          href={`/students/${student.id}/reportcards/trimestres?trimestreId=${trimestreId}&studentId=${student.id}&classroomId=${classroomId}`}
                        />
                      </TableCell>

                      <TableCell className="border text-center" rowSpan={2}>
                        {student.gender == "female" ? "F" : "M"}
                      </TableCell>
                      <TableCell
                        className={cn("border text-center")}
                        rowSpan={2}
                      >
                        <div
                          className={cn(
                            "rounded-2xl",
                            value.average > 10 &&
                              "bg-green-600 p-1.5 text-green-100",
                            value.average < 10 &&
                              "bg-red-600 p-1.5 text-red-100",
                          )}
                        >
                          {value.average.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="border text-center" rowSpan={2}>
                        {value.rank}
                      </TableCell>
                      <TableCell className="border text-center">
                        {seq1}
                      </TableCell>
                      <TableCell className="border text-center">
                        {studentReport.global.grade1Average.toFixed(2)}
                      </TableCell>
                      {Object.keys(groups).map(
                        (groupId: string, indexg: number) => {
                          const items = groups[Number(groupId)]?.sort(
                            (a, b) => a.order - b.order,
                          );

                          if (!items) return null;
                          //const group = items[0];
                          return (
                            <Fragment
                              key={`fragment-${student.id}-${groupId}-${indexg}`}
                            >
                              {items.map((subject, indexs) => {
                                const grade = studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id,
                                );
                                const g = grade?.grade1 ?? 0;
                                return (
                                  <TableCell
                                    className={cn(
                                      "border-l text-center",
                                      g < 10
                                        ? "!bg-red-50 dark:!bg-red-800"
                                        : g < 15
                                          ? "!bg-yellow-50 dark:!bg-yellow-800"
                                          : "!bg-green-50 dark:!bg-green-800",
                                    )}
                                    key={`${subject.id}-${student.id}-${groupId}-${indexs}`}
                                  >
                                    {grade?.grade1?.toFixed(2)}
                                  </TableCell>
                                );
                              })}
                            </Fragment>
                          );
                        },
                      )}
                    </TableRow>
                    <TableRow
                      className="border-b border-b-4"
                      key={`globalrank-${key}-${index}-2`}
                    >
                      <TableCell className="border text-center">
                        {seq2}
                      </TableCell>
                      <TableCell className="border text-center">
                        {studentReport.global.grade2Average.toFixed(2)}
                      </TableCell>
                      {Object.keys(groups).map(
                        (groupId: string, indexg: number) => {
                          const items = groups[Number(groupId)]?.sort(
                            (a, b) => a.order - b.order,
                          );

                          if (!items) return null;
                          //const group = items[0];
                          return (
                            <Fragment
                              key={`fragment-${student.id}-${groupId}-${indexg}-2`}
                            >
                              {items.map((subject, indexs) => {
                                const grade = studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id,
                                );
                                const g = grade?.grade2 ?? 0;
                                return (
                                  <TableCell
                                    className={cn(
                                      "border-l text-center",
                                      g < 10
                                        ? "!bg-red-50 dark:!bg-red-800"
                                        : g < 15
                                          ? "!bg-yellow-50 dark:!bg-yellow-800"
                                          : "!bg-green-50 dark:!bg-green-800",
                                    )}
                                    key={`${subject.id}-${student.id}-${groupId}-${indexs}-2`}
                                  >
                                    {grade?.grade2?.toFixed(2)}
                                  </TableCell>
                                );
                              })}
                            </Fragment>
                          );
                        },
                      )}
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

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
              <TableCell>{Math.min(...averages).toFixed(2)}</TableCell>
              <TableCell>{Math.max(...averages).toFixed(2)}</TableCell>
              <TableCell>
                {(
                  averages.reduce((acc, val) => acc + val, 0) / averages.length
                ).toFixed(2)}
              </TableCell>
              <TableCell>{(successRate * 100).toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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
