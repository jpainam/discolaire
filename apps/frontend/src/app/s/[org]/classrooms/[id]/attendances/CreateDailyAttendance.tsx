"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
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
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const toNonNegInt = z.preprocess(
  (v) => (v === "" || v == null ? 0 : v),
  z.coerce.number().int().nonnegative(),
);

const attendanceItemSchema = z.object({
  studentId: z.string().min(1),
  absence: toNonNegInt.default(0),
  justifiedAbsence: toNonNegInt.default(0),
  consigne: toNonNegInt.default(0),
  lateness: toNonNegInt.default(0),
  justifiedLateness: toNonNegInt.default(0),
  chatter: toNonNegInt.default(0),
});

const formSchema = z.object({
  attendances: z.array(attendanceItemSchema),
});

export function CreateDailyAttendance({
  classroomId,
  date,
}: {
  classroomId: string;
  date: Date;
}) {
  const trpc = useTRPC();
  const studentQuery = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const router = useRouter();

  const t = useTranslations();

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
        const parsed = formSchema.safeParse(value);
        if (!parsed.success) {
          return { error: parsed.error.flatten().fieldErrors };
        }
      },
    },

    onSubmit: ({ value }) => {
      const parsed = formSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(t("validation_error"));
        return;
      }
      const payload = parsed.data.attendances
        // Only send rows where at least one count > 0
        .filter(
          (a) =>
            a.absence ||
            a.justifiedAbsence ||
            a.consigne ||
            a.lateness ||
            a.justifiedLateness ||
            a.chatter,
        )
        .map((a) => ({
          studentId: a.studentId,
          absence: a.absence,
          justifiedAbsence: a.justifiedAbsence,
          chatter: a.chatter,
          consigne: a.consigne,
          lateness: a.lateness,
          justifiedLateness: a.justifiedLateness,
        }));
      //   createPeriodic.mutate({
      //     termId: termId,
      //     classroomId: classroomId,
      //     attendances: payload,
      //   });
    },
  });

  useEffect(() => {
    const students = studentQuery.data ?? [];
    form.setFieldValue(
      "attendances",
      students.map((st) => {
        return {
          studentId: st.id,
          absence: "",
          justifiedAbsence: "",
          chatter: "",
          consigne: "",
          lateness: "",
          justifiedLateness: "",
        };
      }),
    );
  }, [form, studentQuery.data]);

  const students = studentQuery.data ?? [];

  const attendanceMap = useMemo(() => {
    const m = new Map<
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
    (attendanceQuery.data ?? []).forEach((at) => {
      m.set(at.studentId, {
        absence: at.absence,
        justifiedAbsence: at.justifiedAbsence,
        lateness: at.lateness,
        justifiedLateness: at.justifiedLateness,
        consigne: at.consigne,
        chatter: at.chatter,
      });
    });
    return m;
  }, [attendanceQuery.data]);

  if (periodicAttendanceQuery.isPending || studentQuery.isPending) {
    return (
      <div className="h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await form.handleSubmit();
      }}
      className="flex flex-col gap-4 px-4 pt-4 pb-8"
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
              const periodic = periodicMap.get(student.id);
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
                      <div className="flex flex-row items-center gap-2 px-2">
                        {disc.absence != 0 && (
                          <Badge variant={"secondary"}>
                            Absence: {disc.absence}
                          </Badge>
                        )}
                      </div>
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
                      defaultValue={
                        periodic?.absence != 0 ? periodic?.absence : undefined
                      }
                      type="number"
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
                      type="number"
                      defaultValue={
                        periodic?.justifiedAbsence != 0
                          ? periodic?.justifiedAbsence
                          : undefined
                      }
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
                      defaultValue={
                        periodic?.lateness != 0 ? periodic?.lateness : undefined
                      }
                      type="number"
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
                      defaultValue={
                        periodic?.justifiedLateness != 0
                          ? periodic?.justifiedLateness
                          : undefined
                      }
                      type="number"
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
                      defaultValue={
                        periodic?.chatter != 0 ? periodic?.chatter : undefined
                      }
                      type="number"
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
                      defaultValue={
                        periodic?.consigne != 0 ? periodic?.consigne : undefined
                      }
                      type="number"
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
        <Button type="submit">{t("submit")}</Button>
      </div>
    </form>
  );
}
