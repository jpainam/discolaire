"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Form, useForm, useFormContext } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useLocale } from "~/i18n";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { PeriodicAttendanceHeader } from "./PeriodicAttendanceHeader";

const attendanceSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().min(1),
      absence: z.string().optional(),
      lateness: z.string().optional(),
      consigne: z.string().optional(),
      exclusion: z.string().optional(),
      chatter: z.string().optional(),
    }),
  ),
});
type ClassroomStudent = RouterOutputs["classroom"]["students"][number];
export function CreateEditPeridicAttendance({
  students,
}: {
  students: ClassroomStudent[];
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const [termId] = useQueryState("term", parseAsInteger);

  const form = useForm({
    schema: attendanceSchema,
    defaultValues: {
      students: students.map((student) => ({
        id: student.id,
        absence: "",
        lateness: "",
        consigne: "",
        exclusion: "",
        chatter: "",
      })),
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createAttendance = api.attendance.createPeriodic.useMutation({
    onSettled: async () => {
      await utils.attendance.invalidate();
    },
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
      router.push(
        `${routes.classrooms.attendances.index(params.id)}/periodic?type=periodic`,
      );
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof attendanceSchema>) => {
    if (!termId) {
      toast.error(t("select_term"));
      return;
    }
    toast.loading(t("adding"), { id: 0 });
    const values = {
      termId: termId,
      classroomId: params.id,
      students: data.students,
    };
    createAttendance.mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PeriodicAttendanceHeader />
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead className="w-[55px]">
                  <span className="sr-only">AV</span>
                </TableHead>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead></TableHead>
                <TableHead>{t("absence")}</TableHead>
                <TableHead>{t("lateness")}</TableHead>
                <TableHead>{t("chatter")}</TableHead>
                <TableHead>{t("consigne")}</TableHead>
                <TableHead>{t("exclusion")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => {
                return (
                  <TableRow key={student.id}>
                    <TableCell className="py-0 font-medium">
                      {index + 1}.
                      <Input
                        {...form.register(`students.${index}.id`)}
                        type="hidden"
                        defaultValue={student.id}
                      />
                    </TableCell>
                    <TableCell className="py-0 sm:table-cell">
                      <AvatarState pos={index} avatar={student.avatar} />
                    </TableCell>
                    <TableCell className="py-0">
                      <Link
                        className="hover:text-blue-600 hover:underline"
                        href={routes.students.details(student.id)}
                      >
                        {getFullName(student)}
                      </Link>
                    </TableCell>
                    <AttendanceTableRow index={index} studentId={student.id} />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </form>
    </Form>
  );
}

function AttendanceTableRow({
  index,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studentId,
}: {
  index: number;
  studentId: string;
}) {
  // const watchValue = useWatch({ name: `students.${index}` }) as {
  //   id: string;
  //   absence: string;
  //   late: string;
  //   consigned: string;
  //   exclusion: string;
  // };
  const { register } = useFormContext();
  return (
    <>
      <TableCell>
        {/* <div className="flex flex-row gap-1">
          {!watchValue?.absence && (
            <FlatBadge variant={"green"}>Present</FlatBadge>
          )}
          {watchValue?.absence && watchValue?.absence != "0" && (
            <FlatBadge variant={"red"}>Absent</FlatBadge>
          )}
          {watchValue.late && <FlatBadge variant={"yellow"}>Late</FlatBadge>}
          {watchValue.consigned && (
            <FlatBadge variant={"indigo"}>Consigned</FlatBadge>
          )}
        </div> */}
      </TableCell>
      <TableCell className="py-0">
        <Input
          {...register(`students.${index}.absence`)}
          className="h-8 w-[75px]"
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.lateness`)}
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.chatter`)}
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.consigne`)}
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.exclusion`)}
        />
      </TableCell>
    </>
  );
}
