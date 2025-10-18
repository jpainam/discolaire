"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
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
  late: toNonNegInt.default(0),
  justifiedLate: toNonNegInt.default(0),
  chatter: toNonNegInt.default(0),
  exclusion: toNonNegInt.default(0),
});

const formSchema = z.object({
  attendances: z.array(attendanceItemSchema),
});

//type FormValues = z.infer<typeof formSchema>;

export function CreateClassroomAttendance({
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

  const router = useRouter();

  const t = useTranslations();
  const createPeriodic = useMutation(
    trpc.attendance.create.mutationOptions({
      onSuccess: () => {
        toast.success(t("created_successfully"), { id: 0 });
        router.push(`/classrooms/${classroomId}/attendances`);
      },
      onError: (e) => {
        toast.error(e.message, { id: 0 });
      },
    }),
  );

  const attendanceQuery = useQuery(
    trpc.attendance.all.queryOptions({
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
          late: "",
          justifiedLate: "",
          chatter: "",
          exclusion: "",
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
            a.late ||
            a.justifiedLate ||
            a.chatter ||
            a.exclusion,
        )
        .map((a) => ({
          studentId: a.studentId,
          absence: a.absence,
          justifiedAbsence: a.justifiedAbsence,
          chatter: a.chatter,
          consigne: a.consigne,
          lateness: a.late,
          justifiedLateness: a.justifiedLate,
          exclusion: a.exclusion,
        }));
      createPeriodic.mutate({
        termId: termId,
        classroomId: classroomId,
        attendances: payload,
      });
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
          late: "",
          justifiedLate: "",
          exclusion: "",
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
        late: number;
        justifiedLate: number;
        consigne: number;
        chatter: number;
        exclusion: number;
      }
    >();
    (attendanceQuery.data ?? []).forEach((at) => {
      m.set(at.studentId, {
        absence: at.absence,
        justifiedAbsence: at.justifiedAbsence,
        late: at.late,
        justifiedLate: at.justifiedLate,
        consigne: at.consigne,
        chatter: at.chatter,
        exclusion: at.exclusion,
      });
    });
    return m;
  }, [attendanceQuery.data]);

  if (attendanceQuery.isPending || studentQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: 32 }).map((_, index) => {
          return <Skeleton key={index} className="h-8 w-full" />;
        })}
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
              <TableHead>Excusions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              const at = attendanceMap.get(student.id);
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:underline"
                    >
                      {getFullName(student)}
                    </Link>
                    {at && <ExistingAttendanceSummary at={at} />}
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
                      type="number"
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].late`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].justifiedLate`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
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
                      type="number"
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].consigne`,
                          e.target.value,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      onChange={(e) => {
                        form.setFieldValue(
                          `attendances[${index}].exclusion`,
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
        <Button isLoading={createPeriodic.isPending} type="submit">
          {t("submit")}
        </Button>
      </div>
    </form>
  );
}

function ExistingAttendanceSummary({
  at,
}: {
  at: {
    absence: number;
    justifiedAbsence: number;
    late: number;
    justifiedLate: number;
    consigne: number;
    chatter: number;
    exclusion: number;
  };
}) {
  return (
    <div className="flex flex-row items-center gap-2 px-2">
      {at.absence != 0 && (
        <Badge size={"xs"} appearance={"outline"} variant={"destructive"}>
          Absence: {at.absence}{" "}
          {at.justifiedAbsence && <> / {at.justifiedAbsence}</>}
        </Badge>
      )}
      {at.late != 0 && (
        <Badge size={"xs"} appearance={"outline"} variant={"warning"}>
          Retards: {at.late} {at.justifiedLate && <> / {at.justifiedLate}</>}
        </Badge>
      )}
      {at.chatter != 0 && (
        <Badge size={"xs"} appearance={"outline"} variant={"primary"}>
          Bavardages: {at.chatter}
        </Badge>
      )}
      {at.consigne != 0 && (
        <Badge size={"xs"} appearance={"outline"} variant={"info"}>
          Consignes: {at.consigne}
        </Badge>
      )}
      {at.exclusion != 0 && (
        <Badge size={"xs"} appearance={"outline"} variant={"destructive"}>
          Exclusion: {at.exclusion}
        </Badge>
      )}
    </div>
  );
}
