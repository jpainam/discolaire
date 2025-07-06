"use client";

import { BaselineIcon, SaveIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const attendanceSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().min(1),
      absence: z.coerce.number().nullish(),
      justify: z.coerce.number().nullable(),
    }),
  ),
  notifyParents: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
});

export function CreateEditAbsence({
  students,
  termId,
  classroomId,
}: {
  termId: string;
  classroomId: string;
  students: RouterOutputs["classroom"]["students"];
}) {
  const { t } = useLocale();

  const form = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      notifyParents: true,
      notifyStudents: true,
      students: students.map((student) => ({
        id: student.id,
        absence: null,
        justify: null,
      })),
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const createAbsence = useMutation(
    trpc.absence.createClassroom.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.absence.byClassroom.pathFilter(),
        );
        toast.success(t("added_successfully"), { id: 0 });
        router.push(
          `${routes.classrooms.attendances.index(classroomId)}?type=absence&term=${termId}`,
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof attendanceSchema>) => {
    if (!termId) {
      toast.error(t("select_term"));
      return;
    }
    toast.loading(t("adding"), { id: 0 });
    let hasError = false;
    for (const student of data.students) {
      if (!student.absence || !student.justify) {
        continue;
      }
      if (student.absence < student.justify) {
        const std = students.find((s) => s.id === student.id);
        toast.error(
          t("absence_cannot_be_less_than_justify_for", {
            name: getFullName(std),
          }),
        );
        hasError = true;
        break;
      }
    }
    if (!hasError) {
      const absences = data.students
        .map((student) => {
          return {
            id: student.id,
            absence: student.absence ?? 0,
            justify: student.justify ?? 0,
          };
        })
        .filter((student) => student.absence > 0);
      createAbsence.mutate({
        termId: termId,
        students: absences,
      });
    }
  };
  return (
    <Form {...form}>
      <form className="px-2 gap-4 mb-10" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row mb-2 items-center justify-between gap-2 py-1">
          <div className="flex flex-row items-center gap-2">
            <BaselineIcon className="h-4 w-4" />
            <Label className="font-semibold">
              {t("create")} - {t("absence")}
            </Label>
          </div>
          <div className="flex flex-row items-center gap-1">
            <FormField
              control={form.control}
              name="notifyParents"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      defaultChecked
                      id="notifyParents"
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormLabel>{t("notify_parents")}</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifyStudents"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      defaultChecked
                      id="notifyStudents"
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormLabel>{t("notify_students")}</FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <TableCell className="font-medium">
                      {index + 1}.
                      <Input
                        {...form.register(`students.${index}.id`)}
                        type="hidden"
                        defaultValue={student.id}
                      />
                    </TableCell>
                    <TableCell className="sm:table-cell">
                      <AvatarState pos={index} avatar={student.user?.avatar} />
                    </TableCell>
                    <TableCell>
                      <Link
                        className="hover:text-blue-600 hover:underline"
                        href={routes.students.details(student.id)}
                      >
                        {getFullName(student)}
                      </Link>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Input
                        {...form.register(`students.${index}.absence`)}
                        className="h-8 w-[100px]"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
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
