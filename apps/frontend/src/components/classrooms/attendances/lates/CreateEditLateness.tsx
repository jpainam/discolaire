"use client";

import { BaselineIcon, SaveIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Form, useForm } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
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

const attendanceSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().min(1),
      late: z.string().optional(),
      justify: z.string().optional(),
    })
  ),
});

export function CreateEditLateness({
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
        late: "",
        justify: "",
      })),
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createLateness = api.lateness.createClassroom.useMutation({
    onSettled: async () => {
      await utils.absence.invalidate();
    },
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
      router.push(
        `${routes.classrooms.attendances.index(classroomId)}?type=lateness&term=${termId}`
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
    let hasError = false;
    for (const student of data.students) {
      if (!student.late || !student.justify) {
        continue;
      }
      // convert late and justify to hh:mm if not already.
      if (student.late < student.justify) {
        const std = students.find((s) => s.id === student.id);
        toast.error(
          t("late_or_justification_malformed", {
            name: getFullName(std),
          })
        );
        hasError = true;
        break;
      }
    }
    if (!hasError) {
      const lates = data.students
        .map((student) => {
          return {
            id: student.id,
            late: student.late ?? "",
            justify: student.justify ?? "",
          };
        })
        .filter((student) => student.late != "");
      createLateness.mutate({
        termId: termId,
        classroomId: classroomId,
        students: lates,
      });
    }
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
              isLoading={createLateness.isPending}
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
                <TableHead>{t("lateness")} (hh:mm)</TableHead>
                <TableHead>{t("justified")} ((hh:mm))</TableHead>
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
                        {...form.register(`students.${index}.late`)}
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
