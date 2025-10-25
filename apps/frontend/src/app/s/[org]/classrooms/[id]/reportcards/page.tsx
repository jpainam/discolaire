import Link from "next/link";
import { useTranslations } from "next-intl";

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
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  searchParams: Promise<{ termId: string }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { termId } = searchParams;

  if (!termId) {
    return <EmptyState className="my-8" />;
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

  const { t } = await getServerTranslations();

  return (
    <div className="mb-10 flex w-full flex-col gap-2 text-sm">
      <ReportCardActionHeader
        title={`BULLETIN SCOLAIRE : ${term.name}`}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
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
