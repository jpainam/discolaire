"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { useTRPC } from "~/trpc/react";

export const description = "A multiple bar chart";

const average = (s: number[]) => {
  return s.length == 0 ? 0 : s.reduce((a, b) => a + b, 0) / s.length;
};
export function SubjectGradeDistribution() {
  const trpc = useTRPC();
  const params = useParams<{ subjectId: string }>();
  const { data: grades } = useSuspenseQuery(
    trpc.subject.grades.queryOptions(Number(params.subjectId)),
  );

  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());

  const t = useTranslations();
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Label")}</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>{t("average")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {terms.map((t, index) => {
              const gg = grades
                .filter((g) => !g.isAbsent && g.gradeSheet.termId == t.id)
                .map((g) => g.grade);
              const max = gg.length == 0 ? 0 : Math.max(...gg);
              const min = gg.length == 0 ? 0 : Math.min(...gg);
              const avg = average(gg);
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{max}</TableCell>
                  <TableCell>{min}</TableCell>
                  <TableCell>{avg.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
