"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@repo/ui/components/button";
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
      absence: z.string().default(""),
      justifiedAbsence: z.string().default(""),
      consigne: z.string().default(""),
      lateness: z.string().default(""),
      justifiedLateness: z.string().default(""),
      chatter: z.string().default(""),
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
  const createPeriodic = useMutation(
    trpc.periodicAttendance.create.mutationOptions({
      onSuccess: () => {
        toast.success(t("created_successfully"), { id: 0 });
      },
      onError: (e) => {
        toast.error(e.message, { id: 0 });
      },
    }),
  );
  const attendanceQuery = useQuery(
    trpc.discipline.sequence.queryOptions({
      classroomId,
      termId,
    }),
  );
  const periodicAttendanceQuery = useQuery(
    trpc.periodicAttendance.all.queryOptions({
      classroomId,
      termId,
    }),
  );
  const form = useForm({
    defaultValues: {
      attendances: [
        {
          studentId: "",
          absence: "",
          justifiedAbsence: "",
          consigne: "",
          lateness: "",
          justifiedLateness: "",
          chatter: "",
        },
      ],
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = formSchema.safeParse(value);
        if (!result.success) {
          return {
            error: result.error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: ({ value }) => {
      const values = [];
      for (const at of value.attendances) {
        if (
          !at.absence &&
          !at.chatter &&
          !at.consigne &&
          !at.lateness &&
          !at.justifiedAbsence &&
          !at.justifiedLateness
        ) {
          continue;
        }
        const errorMessage = "Incorrect number";
        if (at.absence && !isFinite(parseInt(at.absence))) {
          toast.error(errorMessage);
          return;
        }
        if (at.justifiedAbsence && !isFinite(parseInt(at.justifiedAbsence))) {
          toast.error(errorMessage);
          return;
        }
        if (at.chatter && !isFinite(parseInt(at.chatter))) {
          toast.error(errorMessage);
          return;
        }
        if (at.consigne && !isFinite(parseInt(at.consigne))) {
          toast.error(errorMessage);
          return;
        }
        if (at.lateness && !isFinite(parseInt(at.lateness))) {
          toast.error(errorMessage);
          return;
        }
        if (at.justifiedLateness && !isFinite(parseInt(at.justifiedLateness))) {
          toast.error(errorMessage);
          return;
        }
        values.push({
          studentId: at.studentId,
          absence: parseInt(at.absence),
          absenceJustified: parseInt(at.justifiedAbsence),
          chatter: parseInt(at.chatter),
          consigne: parseInt(at.consigne),
          lateness: parseInt(at.lateness),
          justifiedLateness: parseInt(at.justifiedLateness),
        });
      }
      createPeriodic.mutate({
        termId: termId,
        classroomId: classroomId,
        attendances: values,
      });
    },
  });

  if (periodicAttendanceQuery.isPending || studentQuery.isPending) {
    return (
      <div className="h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const students = studentQuery.data ?? [];
  const periodic = periodicAttendanceQuery.data ?? [];
  const periodicMap = new Map<
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
  periodic.forEach((at) => {
    periodicMap.set(at.studentId, {
      absence: at.absence,
      justifiedAbsence: at.justifiedAbsence,
      lateness: at.lateness,
      justifiedLateness: at.justifiedLateness,
      chatter: at.chatter,
      consigne: at.consigne,
    });
  });
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
  const attendance = attendanceQuery.data ?? [];
  attendance.forEach((at) => {
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="px-4 pb-8"
    >
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
              const disc = attendanceMap.get(student.id);
              const perio = periodicMap.get(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:underline"
                    >
                      {getFullName(student)}
                    </Link>
                    {disc && (
                      <>
                        {disc.absence && (
                          <Badge variant={"secondary"}>
                            Absence: {disc.absence}
                          </Badge>
                        )}
                      </>
                    )}
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
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button type="reset" variant={"secondary"}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("cancel")}</Button>
      </div>
    </form>
  );
}
