"use client";

import { useMemo, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import { AppreciationSelector } from "~/components/shared/selects/AppreciationSelector";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { UserLink } from "~/components/UserLink";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ReportCardOverallAppreciation({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();

  const reportQuery = useQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId: classroomId,
      termId,
    }),
  );

  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const canUpdateReportCard = useCheckPermission("reportcard.update");

  const disciplineQuery = useQuery(
    trpc.discipline.sequence.queryOptions({ termId, classroomId }),
  );
  const [appreciations, setAppreciations] = useState<Record<string, string>>(
    {},
  );
  const [avis, setAvis] = useState<Record<string, string>>({});
  const { studentsMap } = useMemo(() => {
    const studentsMap = new Map(students.map((s) => [s.id, s]));
    return { studentsMap };
  }, [students]);

  if (reportQuery.isPending || disciplineQuery.isPending) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, t) => (
          <Skeleton className="h-20" key={t} />
        ))}
      </div>
    );
  }
  const report = reportQuery.data;
  if (!report) {
    return <></>;
  }
  const { studentsReport, globalRanks } = report;
  const disciplines = disciplineQuery.data;

  return (
    <div>
      <div className="bg-background overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">Abs/Just.</TableHead>
              <TableHead className="text-center">{t("courses")}</TableHead>
              <TableHead className="text-center">Moy.</TableHead>
              <TableHead className="text-center">Rang</TableHead>
              <TableHead className="text-center">App. A: Travail</TableHead>
              <TableHead>
                <div className="flex flex-row items-center justify-between px-2">
                  <span>App. B: Avis Global</span>
                  {canUpdateReportCard && (
                    <Button disabled={!canUpdateReportCard}>Valider</Button>
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(globalRanks).map(([key, value], index) => {
              const studentReport = studentsReport.get(key);
              const student = studentsMap.get(key);
              if (!studentReport || !student) {
                return null;
              }
              const disc = disciplines?.get(student.id);
              return (
                <TableRow
                  className="group/table-row bg-transparent"
                  key={`${student.id}-${index}`}
                >
                  <TableCell>
                    <UserLink
                      profile="student"
                      id={student.id}
                      avatar={student.avatar}
                      name={getFullName(student)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      appearance={"light"}
                      variant={
                        disc?.absence != 0
                          ? "destructive"
                          : disc.justifiedAbsence != 0
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {disc?.absence} / {disc?.justifiedAbsence ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {studentReport.studentCourses.length}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={value.average < 10 ? "destructive" : "success"}
                      appearance={"light"}
                    >
                      {value.average.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{value.rank}</TableCell>
                  <TableCell className="w-1/2">
                    <div className="flex gap-1">
                      <Textarea
                        disabled={!canUpdateReportCard}
                        placeholder="Saisir une appréciation"
                        defaultValue={appreciations[student.id]}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setAppreciations((prev) => ({
                            ...prev,
                            [student.id]: nextValue,
                          }));
                        }}
                      />
                      {canUpdateReportCard && (
                        <AppreciationSelector
                          className="opacity-0 transition-opacity group-hover/table-row:opacity-100"
                          onSelectAction={(e) => {
                            setAppreciations((prev) => ({
                              ...prev,
                              [student.id]: e.content,
                            }));
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-1/2">
                    <div className="flex gap-1">
                      <Textarea
                        disabled={!canUpdateReportCard}
                        placeholder="Saisir votre avis"
                        defaultValue={avis[student.id]}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setAvis((prev) => ({
                            ...prev,
                            [student.id]: nextValue,
                          }));
                        }}
                      />
                      {canUpdateReportCard && (
                        <AppreciationSelector
                          className="opacity-0 transition-opacity group-hover/table-row:opacity-100"
                          onSelectAction={(e) => {
                            setAvis((prev) => ({
                              ...prev,
                              [student.id]: e.content,
                            }));
                          }}
                        />
                      )}
                    </div>
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
