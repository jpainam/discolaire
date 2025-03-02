import type { RouterOutputs } from "@repo/api";
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
import _ from "lodash";
import Link from "next/link";
import { getServerTranslations } from "~/i18n/server";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

type ReportCardResult =
  RouterOutputs["reportCard"]["getClassroom"]["result"][number];

type StudentGradeReport = RouterOutputs["reportCard"]["getGrades"][number];
export async function ReportCardTable({
  result,
  classroomId,
  grades,
  term,
}: {
  result: ReportCardResult[];
  term: number;
  grades: StudentGradeReport[];
  classroomId: string;
}) {
  const { t } = await getServerTranslations();
  const subjects = await api.classroom.subjects(classroomId);
  const studentGrades: Record<string, StudentGradeReport[]> = _.groupBy(
    grades,
    (g) => g.studentId
  );

  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="text-xs">
          <TableHeader>
            {/* <TableRow>
            <TableHead colSpan={5}></TableHead>
            {subjects.map((subject, index) => {
              return (
                <TableHead
                  className="border text-center"
                  colSpan={2}
                  key={`${index}${subject.id}`}
                >
                  {subject.course.reportName}
                </TableHead>
              );
            })}
          </TableRow> */}
            <TableRow className="hover:bg-transparent">
              <TableHead className=" text-center" colSpan={3}>
                {t("fullName")}
              </TableHead>
              <TableHead>{t("avg")}</TableHead>
              <TableHead>{t("rank")}</TableHead>
              {subjects.map((subject, index) => {
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
              {/* {Array.from({ length: subjects.length }).map((_, index) => {
              return (
                <Fragment key={`report${index}`}>
                  <TableHead className="border">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-medium">{t("D1")}</span>
                      <FileTextIcon className="h-4 w-4 stroke-1" />
                      <span>(100%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="border">
                    <div className="flex flex-col items-center gap-1">
                      <span>{t("D2")}</span>
                      <FileTextIcon className="h-4 w-4 stroke-1" />
                      <span>(100%)</span>
                    </div>
                  </TableHead>
                </Fragment>
              );
            })} */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.map((student, index) => {
              if (student.rank < 0) return null;
              const rank =
                index == 0 || result[index - 1]?.avg != student.avg
                  ? student.rank.toString()
                  : result[index - 1]?.rank.toString() + " ex";

              const grades = studentGrades[student.id] ?? [];
              return (
                <TableRow className="bg-transparent" key={student.id}>
                  <TableCell className="w-[10px] py-0">
                    <AvatarState
                      className="h-8 w-8"
                      avatar={student.avatar}
                      pos={index}
                    />
                  </TableCell>
                  <TableCell className=" py-0">
                    <Link
                      className="text-blue-700 underline"
                      href={
                        routes.students.details(student.id) +
                        `/report-cards?term=${term}`
                      }
                    >
                      {student.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="border py-0 text-center">
                    {student.gender == "female" ? "F" : "M"}
                  </TableCell>
                  <TableCell className="border py-0 text-center">
                    {student.avg?.toFixed(2)}
                  </TableCell>
                  <TableCell className="border py-0 text-center">
                    {rank}
                  </TableCell>
                  {subjects.map((subject, index) => {
                    const grade = grades.find(
                      (g) => g.subjectId === subject.id
                    );
                    const g = grade?.grade ?? 0;
                    return (
                      <TableCell
                        key={`grade-${index}${subject.id}`}
                        className={cn(
                          "border-l py-0 text-center",
                          g < 10
                            ? "!bg-red-50 dark:!bg-red-800"
                            : g < 15
                              ? "!bg-yellow-50 dark:!bg-yellow-800"
                              : "!bg-green-50 dark:!bg-green-800"
                        )}
                      >
                        {grade?.grade?.toFixed(2) ?? "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
