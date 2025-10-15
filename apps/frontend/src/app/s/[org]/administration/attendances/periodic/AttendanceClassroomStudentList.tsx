"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import z from "zod";

import { Input } from "@repo/ui/components/input";
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

const formSchema = z.object({
  attendances: z.array(
    z.object({
      studentId: z.string(),
      absence: z.number().min(0).max(100).default(0),
      justifiedAbsence: z.number().min(0).max(100).default(0),
      consigne: z.number().min(0).max(100).default(0),
      lateness: z.number().min(0).max(100).default(0),
      justifiedLateness: z.number().min(0).max(100).default(0),
      chatter: z.number().min(0).max(100).default(0),
    }),
  ),
});

export function AttendanceClassroomStudentList({
  classroomId,
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
  const attendanceQuery = useQuery(
    trpc.periodicAttendance.all.queryOptions({
      classroomId,
      termId,
    }),
  );
  const form = useForm({
    defaultValues: {
      attendances: [{}],
    },
    validators: {
      onBlur: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  if (attendanceQuery.isPending || studentQuery.isPending) {
    return (
      <div className="h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const students = studentQuery.data ?? [];
  const attendances = attendanceQuery.data ?? [];
  const attendanceMap = new Map<
    string,
    {
      absence: number;
      justifiedAbsence: number;
      lateness: number;
      justifiedLateness: number;
      consigne: number;
      chatter: number;
    }
  >();
  attendances.forEach((at) => {
    attendanceMap.set(at.studentId, {
      absence: at.absence,
      justifiedAbsence: at.justifiedAbsence,
      lateness: at.lateness,
      justifiedLateness: at.justifiedLateness,
      chatter: at.chatter,
      consigne: at.consigne,
    });
  });
  return (
    <div className="px-4 pb-8">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("isRepeating")}</TableHead>
              <TableHead></TableHead>
              <TableHead>Absences</TableHead>
              <TableHead>Abs.Just</TableHead>
              <TableHead>Retards</TableHead>
              <TableHead>Ret.Just</TableHead>
              <TableHead>Bavardages</TableHead>
              <TableHead>Consignes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:underline"
                    >
                      {getFullName(student)}
                    </Link>
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
                  <TableCell className="uppercase">
                    {student.gender?.slice(0, 1)}
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].absence`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].justifiedAbsence`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].lateness`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].justifiedLateness`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].chatter`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].consigne`,
                          e.target.value,
                        );
                      }}
                    />
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
