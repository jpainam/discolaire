import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";
import { Suspense } from "react";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getAppreciations } from "~/utils/get-appreciation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const grades = await caller.student.grades({ id });
  const vv: Record<
    number,
    { id: number; subject: string; observation: string; grades: number[] }
  > = {};

  grades.forEach((grade) => {
    if (grade.gradeSheet.subjectId) {
      vv[grade.gradeSheet.subjectId] ??= {
        id: grade.gradeSheet.subjectId,
        subject: grade.gradeSheet.subject.course.name,
        observation: grade.observation ?? "",
        grades: [],
      };
      vv[grade.gradeSheet.subjectId]?.grades.push(grade.grade);
    }
  });

  const { t } = await getServerTranslations();
  const data = Object.values(vv).map((entry) => ({
    subject: entry.subject,
    grade1: entry.grades[0] ?? null,
    grade2: entry.grades[1] ?? null,
    grade3: entry.grades[2] ?? null,
    grade4: entry.grades[3] ?? null,
    grade5: entry.grades[4] ?? null,
    grade6: entry.grades[5] ?? null,
    observation: entry.observation,
  }));

  return (
    <div className="px-4 py-2">
      <Suspense
        key={id}
        fallback={
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton className="h-8" key={i} />
            ))}
          </div>
        }
      >
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("subject")}</TableHead>
                <TableHead>{t("grade1")}</TableHead>
                <TableHead>{t("grade2")}</TableHead>
                <TableHead>{t("grade3")}</TableHead>
                <TableHead>{t("grade4")}</TableHead>
                <TableHead>{t("grade5")}</TableHead>
                <TableHead>{t("grade6")}</TableHead>
                <TableHead>{t("average")}</TableHead>
                <TableHead className="text-right">
                  {t("appreciation")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const totalGrades =
                  (row.grade1 ?? 0) +
                  (row.grade2 ?? 0) +
                  (row.grade3 ?? 0) +
                  (row.grade4 ?? 0) +
                  (row.grade5 ?? 0) +
                  (row.grade6 ?? 0);

                const gradeCount =
                  (row.grade1 ? 1 : 0) +
                  (row.grade2 ? 1 : 0) +
                  (row.grade3 ? 1 : 0) +
                  (row.grade4 ? 1 : 0) +
                  (row.grade5 ? 1 : 0) +
                  (row.grade6 ? 1 : 0);

                const avg = gradeCount > 0 ? totalGrades / gradeCount : 0;
                const avgText = avg > 0 ? avg.toFixed(2) : "";

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.subject}</TableCell>
                    <Cell grade={row.grade1} />
                    <Cell grade={row.grade2} />
                    <Cell grade={row.grade3} />
                    <Cell grade={row.grade4} />
                    <Cell grade={row.grade5} />
                    <Cell grade={row.grade6} />
                    <TableCell className="text-muted-foreground">
                      {avgText}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {getAppreciations(avg)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Suspense>
    </div>
  );
}

function Cell({ grade }: { grade?: number | null }) {
  const g = grade ?? 0;
  const gradeText = g > 0 ? g.toFixed(2) : "";
  return (
    <TableCell
      className={cn(
        "text-muted-foreground",
        g >= 18 ? "text-green-500" : "",
        g < 10 ? "text-red-500" : "",
      )}
    >
      {gradeText}
    </TableCell>
  );
}
