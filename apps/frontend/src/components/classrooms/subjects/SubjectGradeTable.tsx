"use client";

import { useMemo } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { TermType } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui//table";
import { UserLink } from "~/components/UserLink";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const getTrendIcon = (grades: number[]) => {
  const total = grades.length;
  if (total == 0) {
    return <Minus className="text-muted-foreground h-4 w-4" />;
  }
  const half = total / 2;
  const firstHalf = grades.slice(0, half).reduce((sum, g) => sum + g, 0) / half;
  const secondHalf = grades.slice(half).reduce((sum, g) => sum + g, 0) / half;
  const diff = secondHalf - firstHalf;

  if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="text-muted-foreground h-4 w-4" />;
};
const getGradeColor = (grade?: number) => {
  if (!grade) return null;
  if (grade >= 18) return "text-green-600 dark:text-green-400";
  if (grade >= 15) return "text-blue-600 dark:text-blue-400";
  if (grade >= 10) return "";
  return "text-red-600 dark:text-red-400";
};

const calcAverage = (termGrades: number[]) => {
  return (
    Math.round(
      (termGrades.reduce((sum, grade) => sum + grade, 0) / termGrades.length) *
        10,
    ) / 10
  );
};

export function SubjectGradeTable({ subjectId }: { subjectId: number }) {
  const trpc = useTRPC();
  const { data: grades } = useSuspenseQuery(
    trpc.subject.grades.queryOptions(subjectId),
  );
  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());
  const groups = useMemo(() => {
    const map = new Map<
      string,
      {
        studentId: string;
        name: string;
        grades: {
          termId: string;
          grade: number;
          isAbsent: boolean;
          id: number;
        }[];
      }
    >();

    for (const grade of grades) {
      const studentId = grade.student.id;
      const entry = map.get(studentId);

      const g = {
        termId: grade.gradeSheet.termId,
        grade: grade.grade,
        isAbsent: grade.isAbsent ?? false,
        id: grade.id,
      };

      if (!entry) {
        map.set(studentId, {
          studentId: grade.studentId,
          name: getFullName(grade.student),
          grades: [g],
        });
      } else {
        entry.grades.push(g);
      }
    }

    return map;
  }, [grades]);

  const t = useTranslations();
  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      {/* <div>
        <InputGroup className="w-96" aria-label="Search attendance records">
          <InputGroupInput
            //onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon aria-hidden>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div> */}
      {/* <div className="max-h-[300px] overflow-x-auto overflow-y-auto"></div> */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              {terms
                .filter((t) => t.type == TermType.MONTHLY)
                .map((t, index) => (
                  <TableHead
                    key={`${t.id}-${index}-head`}
                    className="text-center"
                  >
                    {t.name.slice(0, 6)}
                  </TableHead>
                ))}

              <TableHead className="text-center">{t("average")}</TableHead>
              <TableHead className="text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(groups.values()).map((group, index) => {
              const avatar = createAvatar(initials, {
                seed: group.name,
              });
              const average = calcAverage(
                group.grades.filter((g) => !g.isAbsent).map((g) => g.grade),
              );

              return (
                <TableRow key={index}>
                  <TableCell className="py-1">
                    <UserLink
                      profile={"student"}
                      name={group.name}
                      id={group.studentId}
                      avatar={avatar.toDataUri()}
                    />
                  </TableCell>
                  {terms
                    .filter((t) => t.type == TermType.MONTHLY)
                    .map((t, iindex) => {
                      const gs = group.grades.filter((gr) => gr.termId == t.id);
                      const g = gs[0];
                      return (
                        <TableCell
                          className={`py-1 text-center ${getGradeColor(g?.grade)}`}
                          key={`${t.id}-${index}-${iindex}`}
                        >
                          {gs.map((gg) => gg.grade).join(",")}
                        </TableCell>
                      );
                    })}
                  <TableCell className="text-center">
                    <Badge
                      variant={average > 10 ? "info" : "warning"}
                      appearance={"outline"}
                    >
                      {average.toFixed(2)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    {getTrendIcon(
                      group.grades
                        .filter((g) => !g.isAbsent)
                        .map((g) => g.grade),
                    )}
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
