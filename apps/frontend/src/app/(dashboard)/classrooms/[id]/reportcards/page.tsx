import { Suspense } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@repo/ui/components/skeleton";
//import { ReportCardTable } from "~/components/classrooms/reportcards/ReportCardTable2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";

import { AvatarState } from "~/components/AvatarState";
import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import { EmptyComponent } from "~/components/EmptyComponent";
import { caller, getQueryClient, trpc } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{ termId: string }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { termId } = searchParams;

  if (!termId) {
    return (
      <EmptyComponent
        title="Veuillez choisir une période"
        description="Choisissez une période ou un trimestre pour commencer"
      />
    );
  }
  const {
    studentsReport,
    summary: _summary,
    globalRanks,
  } = await caller.reportCard.getSequence({
    classroomId: params.id,
    termId: termId,
  });

  const classroom = await caller.classroom.get(params.id);
  const term = await caller.term.get(termId);
  const subjects = await caller.classroom.subjects(params.id);
  const students = await caller.classroom.students(params.id);
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  //const groups = _.groupBy(subjects, "subjectGroupId");

  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;

  // const discipline = await caller.discipline.classroom({
  //   classroomId: params.id,
  // });

  const t = await getTranslations();

  return (
    <div className="mb-10 flex w-full flex-col gap-2 text-sm">
      <ReportCardActionHeader
        title={`BULLETIN SCOLAIRE : ${term.name}`}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw?classroomId=${params.id}&termId=${termId}`}
      />
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <CheckSubjectScale termId={termId} classroomId={params.id} />
      </Suspense>

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

async function CheckSubjectScale({
  termId,
  classroomId,
}: {
  termId: string;
  classroomId: string;
}) {
  const queryClient = getQueryClient();
  const allweights = await queryClient.fetchQuery(
    trpc.gradeSheet.subjectWeight.queryOptions({
      classroomId,
      termId: [termId],
    }),
  );
  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const areNot100percent = allweights.filter((s) => !s.weight || s.weight < 1);
  if (areNot100percent.length == 0) {
    return <></>;
  }
  return (
    <div className="px-4">
      <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
        <p className="text-sm">
          <CircleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          Les cours suivants n'ont pas un poids de 100%:
          {areNot100percent.map((a, index) => {
            const subject = subjects.find((s) => s.id == a.subjectId);
            return (
              <span className="px-2" key={index}>
                {subject?.course.shortName}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
