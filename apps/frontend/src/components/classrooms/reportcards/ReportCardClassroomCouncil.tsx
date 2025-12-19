"use client";

import { useMemo } from "react";
import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { UserLink } from "~/components/UserLink";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ReportCardClassroomCouncil({
  classroomId,
  termId,
  students,
}: {
  classroomId: string;
  termId: string;
  students: RouterOutputs["classroom"]["students"];
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const reportQuery = useQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId: classroomId,
      termId,
    }),
  );

  const disciplineQuery = useQuery(
    trpc.discipline.sequence.queryOptions({ termId, classroomId }),
  );
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
                  className="bg-transparent"
                  key={`${student.id}-${index}`}
                >
                  <TableCell>
                    <UserLink
                      profile="student"
                      id={student.id}
                      avatar={student.user?.avatar}
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
                    <InputGroup>
                      <InputGroupInput placeholder="Saisir votre observation..." />
                      <InputGroupAddon align="inline-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AppreciationSelector>
                              <InputGroupButton
                                variant="ghost"
                                aria-label="Info"
                                size="icon-xs"
                                onMouseDown={(e) => e.preventDefault()} // key line
                              >
                                <HugeiconsIcon icon={MagicWand01Icon} />
                              </InputGroupButton>
                            </AppreciationSelector>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Générer une observation</p>
                          </TooltipContent>
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroup>
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
