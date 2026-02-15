"use client";

import { useMemo, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import { AppreciationSelector } from "~/components/shared/selects/AppreciationSelector";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ReportCardSubjectRemark({
  classroomId,
  termId,
  subjectId,
}: {
  classroomId: string;
  termId: string;
  subjectId: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();

  const { data: subject } = useSuspenseQuery(
    trpc.subject.get.queryOptions(subjectId),
  );

  const reportQuery = useQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId: classroomId,
      termId,
    }),
  );
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const disciplineQuery = useQuery(
    trpc.discipline.sequence.queryOptions({ termId, classroomId }),
  );
  const canUpdateReportCard = useCheckPermission("reportcard.update");
  const [councilNotes, setCouncilNotes] = useState<Record<string, string>>({});
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
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">Abs/Just</TableHead>
              <TableHead>{subject.course.reportName}</TableHead>
              <TableHead className="text-center">Moy.</TableHead>
              <TableHead className="text-center">Rang</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-between pr-4">
                  <span>Appréciation matière</span>
                  {canUpdateReportCard && (
                    <Button disabled={!canUpdateReportCard}>
                      {t("submit")}
                    </Button>
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
              const s = studentReport.studentCourses.find(
                (subj) => subj.subjectId == Number(subjectId),
              );
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
                    <Badge
                      appearance={"light"}
                      variant={
                        (s?.average ?? 0) < 10 ? "destructive" : "success"
                      }
                    >
                      {s?.average?.toFixed(2)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    {value.average.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{value.rank}</TableCell>
                  <TableCell className="w-full">
                    <div className="flex items-center gap-1">
                      <InputGroup>
                        <InputGroupInput
                          disabled={!canUpdateReportCard}
                          placeholder="Saisir appréciation..."
                          value={councilNotes[student.id] ?? ""}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setCouncilNotes((prev) => ({
                              ...prev,
                              [student.id]: nextValue,
                            }));
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            aria-label="clear"
                            title="Clear"
                            type="button"
                            size="icon-xs"
                            disabled={!councilNotes[student.id]}
                            onClick={() => {
                              setCouncilNotes((prev) => ({
                                ...prev,
                                [student.id]: "",
                              }));
                            }}
                          >
                            {councilNotes[student.id] && <XIcon />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      {canUpdateReportCard && (
                        <AppreciationSelector
                          className="opacity-0 transition-opacity group-hover/table-row:opacity-100"
                          onSelectAction={(e) => {
                            setCouncilNotes((prev) => ({
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
