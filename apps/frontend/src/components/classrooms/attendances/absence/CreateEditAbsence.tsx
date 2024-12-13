"use client";

import Link from "next/link";
import { BaselineIcon, SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Form, useForm } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
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
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

const attendanceSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().min(1),
      absence: z.coerce.number().nullish(),
      justify: z.coerce.number().nullable(),
    }),
  ),
});

export function CreateEditAbsence({
  students,
  termId,
  classroomId,
}: {
  termId: number;
  classroomId: string;
  students: RouterOutputs["classroom"]["students"];
}) {
  const { t } = useLocale();

  const form = useForm({
    schema: attendanceSchema,
    defaultValues: {
      students: students.map((student) => ({
        id: student.id,
        absence: null,
        justify: null,
      })),
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createAbsence = api.absence.createClassroom.useMutation({
    onSettled: async () => {
      await utils.absence.invalidate();
    },
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
      router.push(
        `${routes.classrooms.attendances.index(classroomId)}?type=absence&term=${termId}`,
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
    console.log(data);
    // const values = {
    //   termId: termId,
    //   classroomId: classroomId,
    //   students: data.students
    //     .map((student) => {
    //       return {
    //         id: student.id,
    //         absence: student.absence,
    //         justify: student.justify,
    //       };
    //     })
    //     .filter((student) => student.absence),
    // };
    //createAbsence.mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center justify-between gap-2 py-1">
          <div className="flex flex-row items-center gap-2">
            <BaselineIcon className="h-4 w-4" />
            <Label className="font-semibold">
              {t("create")} - {t("absence")}
            </Label>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Checkbox defaultChecked id="notifyParents" />{" "}
            <Label htmlFor="notifyParents">{t("notify_parents")}</Label>
            <span className="mr-2" />{" "}
            <Checkbox defaultChecked id="notifyStudents" />
            <Label htmlFor="notifyStudents">{t("notify_students")}</Label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={() => {
                router.push(routes.classrooms.attendances.index(classroomId));
              }}
              size={"sm"}
              type="button"
              variant={"outline"}
            >
              <XIcon className="mr-1 h-4 w-4" />
              {t("cancel")}
            </Button>
            <Button
              isLoading={createAbsence.isPending}
              size={"sm"}
              variant={"default"}
            >
              <SaveIcon className="mr-1 h-4 w-4" />
              {t("submit")}
            </Button>
          </div>
        </div>
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
                <TableHead>{t("justified")}</TableHead>
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
                    <TableCell></TableCell>
                    <TableCell className="py-0">
                      <Input
                        {...form.register(`students.${index}.absence`)}
                        className="h-8 w-[100px]"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="py-0">
                      <Input
                        className="h-8 w-[100px]"
                        type="number"
                        {...form.register(`students.${index}.justify`)}
                      />
                    </TableCell>
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
