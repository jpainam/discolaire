"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

import { EmptyComponent } from "~/components/EmptyComponent";
import { useTRPC } from "~/trpc/react";
import { getAppreciations } from "~/utils/appreciations";

export function StudentGradesheetTable({ className }: { className?: string }) {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({ id: params.id }),
  );

  const { data: classroom } = useSuspenseQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );

  const t = useTranslations();

  const data = useMemo(() => {
    const vv: Record<
      number,
      { id: number; subject: string; observation: string; grades: number[] }
    > = {};

    grades.forEach((grade) => {
      const subjectId = grade.gradeSheet.subjectId;
      if (!subjectId) return;

      vv[subjectId] ??= {
        id: subjectId,
        subject: grade.gradeSheet.subject.course.reportName,
        observation: grade.observation ?? "",
        grades: [],
      };

      vv[subjectId].grades.push(grade.grade);
    });

    return Object.values(vv).map((entry) => ({
      subjectId: entry.id,
      subject: entry.subject,
      grade1: entry.grades[0],
      grade2: entry.grades[1],
      grade3: entry.grades[2],
      grade4: entry.grades[3],
      grade5: entry.grades[4],
      grade6: entry.grades[5],
      observation: entry.observation,
    }));
  }, [grades]);

  if (!classroom) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DollarSign />
          </EmptyMedia>
          <EmptyTitle>Aucune note</EmptyTitle>
          <EmptyDescription>{t("student_not_registered_yet")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className={cn("py-2", className)}>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("subject")}</TableHead>
              <TableHead>Seq 1</TableHead>
              <TableHead>Seq 2</TableHead>
              <TableHead>Seq 3</TableHead>
              <TableHead>Seq 4</TableHead>
              <TableHead>Seq 5</TableHead>
              <TableHead>Seq 6</TableHead>
              <TableHead className="text-center">{t("avg")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  <EmptyComponent title={t("no_data")} />
                </TableCell>
              </TableRow>
            )}
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
                  <TableCell className="font-medium">
                    <Link
                      className="hover:underline"
                      href={`/classrooms/${classroom.id}/${row.subjectId}`}
                    >
                      {row.subject}
                    </Link>
                  </TableCell>
                  <Cell grade={row.grade1} />
                  <Cell grade={row.grade2} />
                  <Cell grade={row.grade3} />
                  <Cell grade={row.grade4} />
                  <Cell grade={row.grade5} />
                  <Cell grade={row.grade6} />
                  <TableCell className="text-muted-foreground text-center">
                    {avgText}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center text-right">
                    {getAppreciations(avg)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Cell({ grade }: { grade?: number }) {
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
