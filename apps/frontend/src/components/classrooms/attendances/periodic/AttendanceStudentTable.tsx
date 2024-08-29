"use client";

import Link from "next/link";
import { useForm, useFormContext, useWatch } from "react-hook-form";

import { useLocale } from "@repo/i18n";
import FlatBadge from "@repo/ui/FlatBadge";
import { Form } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { PeriodicAttendanceHeader } from "./PeriodicAttendanceHeader";

export function AttendanceStudentTable({
  classroomId,
}: {
  classroomId: string;
}) {
  const { t } = useLocale();
  const form = useForm();
  const classroomStudentsQuery = api.classroom.students.useQuery(classroomId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PeriodicAttendanceHeader />
        <Table className="rounded-md border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[55px]">
                <span className="sr-only">AV</span>
              </TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead></TableHead>
              <TableHead>T.{t("absences")}</TableHead>
              <TableHead>T.{t("lates")}</TableHead>
              <TableHead>T.{t("consignes")}</TableHead>
              <TableHead>T.{t("exclusions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classroomStudentsQuery.data?.map((student, index) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="py-0 font-medium">
                    {index + 1}.
                    <Input
                      {...form.register(`students[${index}].id`)}
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
  const watchValue = useWatch({ name: `students.${index}` }) as {
    id: string;
    absence: string;
    late: string;
    consigned: string;
    exclusion: string;
  };
  const { register } = useFormContext();
  return (
    <>
      <TableCell>
        <div className="flex flex-row gap-1">
          {!watchValue.absence && (
            <FlatBadge variant={"green"}>Present</FlatBadge>
          )}
          {watchValue.absence && watchValue.absence != "0" && (
            <FlatBadge variant={"red"}>Absent</FlatBadge>
          )}
          {watchValue.late && <FlatBadge variant={"yellow"}>Late</FlatBadge>}
          {watchValue.consigned && (
            <FlatBadge variant={"indigo"}>Consigned</FlatBadge>
          )}
        </div>
      </TableCell>
      <TableCell className="py-0">
        <Input
          {...register(`students.${index}.absence`)}
          type="number"
          className="h-8 w-[75px]"
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.late`)}
          type="number"
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.consigned`)}
          type="number"
        />
      </TableCell>
      <TableCell className="py-0">
        <Input
          className="h-8 w-[75px]"
          {...register(`students.${index}.exclusion`)}
          type="number"
        />
      </TableCell>
    </>
  );
}
