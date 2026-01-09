"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { ReportCardActionHeader } from "./ReportCardActionHeader";

export function ReportCardAnnual({
  classroomId,
  term,
  subjects,
}: {
  classroomId: string;
  term: RouterOutputs["term"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const termId = term.id;
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const {
    data: { studentsReport, summary: _summary, globalRanks },
  } = useSuspenseQuery(
    trpc.reportCard.getAnnualReport.queryOptions({
      classroomId,
      termId,
    }),
  );
  const { successRate, average, averages } = useMemo(() => {
    const values = Array.from(globalRanks.values());
    const averages = values.map((g) => g.average);
    const successCount = averages.filter((val) => val >= 10).length;
    const successRate = successCount / averages.length;

    const average =
      averages.reduce((acc, val) => acc + val, 0) / averages.length;
    return { successRate, average, averages };
  }, [globalRanks]);

  // const { data: disciplines, isPending: isPendingDiscipline } = useQuery(
  //   trpc.discipline.annual.queryOptions({
  //     classroomId: classroom.id,
  //   }),
  // );

  const studentsMap = new Map(students.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-2">
      <ReportCardActionHeader
        title={"BULLETIN ANNUEL"}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/annual?termId=${termId}&classroomId=${classroomId}&format=pdf`}
      />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">Red</TableHead>
              <TableHead className="text-center">Moy</TableHead>
              <TableHead className="text-center">Rang</TableHead>
              {subjects.map((subject) => (
                <TableHead key={subject.id} className="text-center">
                  <Link
                    className="hover:underline"
                    href={`/classrooms/${subject.classroomId}/subjects/${subject.id}`}
                  >
                    {subject.course.reportName.slice(0, 4)}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from(globalRanks).map(([key, value], index) => {
              const studentReport = studentsReport.get(key);

              const stud = studentsMap.get(key);
              if (!studentReport || !stud) return null;

              return (
                <TableRow key={`${key}-${index}`}>
                  <TableCell>
                    <Link
                      className="hover:underline"
                      href={`/students/${stud.id}/reportcards?action=annual&termId=${term.id}`}
                    >
                      {stud.lastName ?? stud.firstName} (
                      {stud.gender == "female" ? "F" : "M"})
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={stud.isRepeating ? "destructive" : "secondary"}
                      appearance={"light"}
                    >
                      {stud.isRepeating ? t("yes") : t("no")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      appearance={"light"}
                      variant={value.average < 10 ? "destructive" : "success"}
                    >
                      {value.average.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{value.rank}</TableCell>
                  {subjects.map((subject) => {
                    const courseReport = studentReport.studentCourses.find(
                      (c) => c.subjectId === subject.id,
                    );
                    return (
                      <TableCell
                        key={`${key}-${subject.id}-${index}`}
                        className={cn(
                          "text-center",
                          courseReport?.average != null &&
                            courseReport.average < 10
                            ? "text-red-600"
                            : "",
                        )}
                      >
                        {courseReport?.average != null
                          ? courseReport.average.toFixed(2)
                          : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Moy Min</TableHead>
              <TableHead className="text-center">Moy Max</TableHead>
              <TableHead className="text-center">Moy</TableHead>
              <TableHead className="text-center">Taux de réussite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center">
                {Math.min(...averages).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {Math.max(...averages).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {average.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {(successRate * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
