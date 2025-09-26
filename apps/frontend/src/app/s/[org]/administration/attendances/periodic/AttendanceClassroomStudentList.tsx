"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { Badge } from "~/components/base-badge";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function AttendanceClassroomStudentList({
  classroomId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const trpc = useTRPC();
  const studentQuery = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const t = useTranslations();

  const students = studentQuery.data ?? [];
  return (
    <div className="px-4 pb-8">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("isRepeating")}</TableHead>
              <TableHead>{t("gender")}</TableHead>
              <TableHead>Absences</TableHead>
              <TableHead>Consignes</TableHead>
              <TableHead>Retards</TableHead>
              <TableHead>Bavardages</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {getFullName(student)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.isRepeating ? "destructive" : "secondary"
                      }
                      appearance={"outline"}
                    >
                      {student.isRepeating ? t("yes") : t("no")}
                    </Badge>
                  </TableCell>
                  <TableCell>{t(student.gender ?? "")}</TableCell>
                  <TableCell className="text-right">.00</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
