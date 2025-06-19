import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import i18next from "i18next";
import Link from "next/link";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export async function RecentGradesTable() {
  const { t } = await getServerTranslations();
  const grades = await caller.gradeSheet.getLatestGradesheet({ limit: 5 });
  const latest: {
    id: number;
    subject: string;
    classroom: string;
    classroomId: string;
    minGrade: number;
    avgGrade: number;
    maxGrade: number;
    successRate: number;
    date: Date;
  }[] = [];
  grades.forEach((gradeSheet) => {
    const subject = gradeSheet.subject.course.name;
    const classroom = gradeSheet.subject.classroom.name;
    const minGrade = Math.min(...gradeSheet.grades.map((g) => g.grade));
    const successRate =
      gradeSheet.grades.filter((g) => g.grade >= 10).length /
      gradeSheet.grades.length;

    const avgGrade =
      gradeSheet.grades.reduce((sum, g) => sum + g.grade, 0) /
      gradeSheet.grades.length;
    const maxGrade = Math.max(...gradeSheet.grades.map((g) => g.grade));
    latest.push({
      id: gradeSheet.id,
      subject: subject,
      classroomId: gradeSheet.subject.classroom.id,
      classroom,
      minGrade,
      avgGrade,
      maxGrade,
      successRate,
      date: gradeSheet.createdAt,
    });
  });
  return (
    <div>
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("classroom")}</TableHead>
            <TableHead>{t("subject")}</TableHead>
            {/* <TableHead className="text-right">{t("Min")}</TableHead> */}
            <TableHead className="text-right">{t("Moy.")}</TableHead>
            <TableHead className="text-right">% {">= 10"}</TableHead>
            <TableHead className="text-right">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latest.map((g, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Link
                    href={`/classrooms/${g.classroomId}`}
                    className="hover:underline"
                  >
                    {g.classroom}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/classrooms/${g.classroomId}/gradesheets/${g.id}`}
                    className="hover:underline"
                  >
                    {g.subject}
                  </Link>
                </TableCell>
                {/* <TableCell className="text-right">
                {g.minGrade.toFixed(2)}
              </TableCell> */}
                <TableCell className="text-right">
                  {g.avgGrade.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {(g.successRate * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  {g.date.toLocaleDateString(i18next.language, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
