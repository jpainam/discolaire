"use client";

import { useMemo, useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppreciationSelector } from "~/components/shared/selects/AppreciationSelector";
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
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ReportCardClassroomCouncil({
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

  const disciplineQuery = useQuery(
    trpc.discipline.sequence.queryOptions({ termId, classroomId }),
  );
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
              <TableHead className="text-center">Abs. Just/NonJ</TableHead>
              <TableHead className="text-center">Consigne</TableHead>
              <TableHead className="text-center">Bavardage</TableHead>
              <TableHead className="text-center">Exclusion</TableHead>
              <TableHead className="text-center">Moy.</TableHead>
              <TableHead className="text-center">Rang</TableHead>
              <TableHead className="text-center">Conseil de classe</TableHead>
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
                  className="group/row-council bg-transparent"
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
                    {disc?.justifiedAbsence} /{" "}
                    {(disc?.absence ?? 0) - (disc?.justifiedAbsence ?? 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {disc?.consigne}
                  </TableCell>
                  <TableCell className="text-center">{disc?.chatter}</TableCell>
                  <TableCell className="text-center">
                    {disc?.exclusion}
                  </TableCell>
                  <TableCell className="text-center">
                    {value.average.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{value.rank}</TableCell>
                  <TableCell className="w-full">
                    <div className="flex items-center gap-1">
                      <InputGroup>
                        <InputGroupInput
                          placeholder="Saisir conseil..."
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

                      <AppreciationSelector
                        onSelectAction={(e) => {
                          setCouncilNotes((prev) => ({
                            ...prev,
                            [student.id]: e.content,
                          }));
                        }}
                      />
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
