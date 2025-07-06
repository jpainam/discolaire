"use client";

import { SaveIcon, ShieldAlertIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Form } from "@repo/ui/components/form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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
      from: z.coerce.date().nullish(),
      to: z.coerce.date().nullish(),
      reason: z.string().nullish(),
    }),
  ),
});

export function CreateEditExclusion({
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
      students: students.map((student) => ({
        id: student.id,
        from: null,
        to: null,
        reason: "",
      })),
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const createExclusion = useMutation(
    trpc.exclusion.createClassroom.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.exclusion.byClassroom.pathFilter(),
        );
        toast.success(t("added_successfully"), { id: 0 });
        router.push(
          `/classrooms/${classroomId}/attendances?type=exclusion&term=${termId}`,
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
    toast.loading(t("creating"), { id: 0 });
    let hasError = false;
    for (const student of data.students) {
      if (!student.from || !student.to) {
        continue;
      }
      // convert late and justify to hh:mm if not already.
      if (student.to < student.from) {
        const std = students.find((s) => s.id === student.id);
        toast.error(`Erreur avec ${getFullName(std)}`, { id: 0 });
        hasError = true;
        break;
      }
    }
    if (!hasError) {
      const exclusions = data.students
        .map((student) => {
          return {
            id: student.id,
            from: student.from,
            to: student.to,
            reason: student.reason,
          };
        })
        .filter((student) => student.from && student.to);
      createExclusion.mutate({
        termId: termId,
        students: exclusions,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex flex-row items-center gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlertIcon className="h-6 w-6" />
                {t("exclusion")}
              </div>
              <div className="ml-auto flex flex-row items-center gap-2">
                <Button
                  onClick={() => {
                    router.push(
                      routes.classrooms.attendances.index(classroomId),
                    );
                  }}
                  size={"sm"}
                  type="button"
                  variant={"outline"}
                >
                  <XIcon className="mr-1 h-4 w-4" />
                  {t("cancel")}
                </Button>
                <Button
                  isLoading={createExclusion.isPending}
                  size={"sm"}
                  variant={"default"}
                >
                  <SaveIcon className="mr-1 h-4 w-4" />
                  {t("submit")}
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="gap-6 flex flex-row items-center">
              <div className="flex flex-row items-center gap-2">
                <Checkbox defaultChecked id="notifyParents" />{" "}
                <Label htmlFor="notifyParents">{t("notify_parents")}</Label>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Checkbox defaultChecked id="notifyStudents" />
                <Label htmlFor="notifyStudents">{t("notify_students")}</Label>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between gap-2 py-1"></div>
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
                    <TableHead>{t("from")}</TableHead>
                    <TableHead>{t("to")}</TableHead>
                    <TableHead>{t("reason")}</TableHead>
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
                          <AvatarState
                            pos={index}
                            avatar={student.user?.avatar}
                          />
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
                        <TableCell>
                          <Input
                            {...form.register(`students.${index}.from`)}
                            className="h-8"
                            type="date"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            {...form.register(`students.${index}.to`)}
                            className="h-8"
                            type="date"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            className="h-8"
                            type="text"
                            {...form.register(`students.${index}.reason`)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
