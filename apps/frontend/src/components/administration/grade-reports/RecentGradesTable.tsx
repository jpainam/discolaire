import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import i18next from "i18next";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export async function RecentGradesTable() {
  const { t } = await getServerTranslations();
  const grades = await caller.gradeSheet.getLatestGradesheet({ limit: 5 });
  const latest: {
    subject: string;
    classroom: string;
    minGrade: number;
    avgGrade: number;
    maxGrade: number;
    date: Date;
  }[] = [];
  grades.forEach((gradeSheet) => {
    const subject = gradeSheet.subject.course.name;
    const classroom = gradeSheet.subject.classroom.name;
    const minGrade = Math.min(...gradeSheet.grades.map((g) => g.grade));
    const avgGrade =
      gradeSheet.grades.reduce((sum, g) => sum + g.grade, 0) /
      gradeSheet.grades.length;
    const maxGrade = Math.max(...gradeSheet.grades.map((g) => g.grade));
    latest.push({
      subject: subject,
      classroom,
      minGrade,
      avgGrade,
      maxGrade,
      date: gradeSheet.createdAt,
    });
  });
  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow>
          <TableHead>{t("subject")}</TableHead>
          <TableHead>{t("classroom")}</TableHead>
          <TableHead className="text-right">{t("Min")}</TableHead>
          <TableHead className="text-right">{t("Avg")}</TableHead>
          <TableHead className="text-right">{t("Min")}</TableHead>
          <TableHead className="text-right">{t("date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {latest.map((g, index) => {
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{g.classroom}</TableCell>
              <TableCell>{g.subject}</TableCell>
              <TableCell className="text-right">
                {g.minGrade.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {g.avgGrade.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {g.maxGrade.toFixed(2)}
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
  );
}
