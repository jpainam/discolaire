"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AvatarState } from "~/components/AvatarState";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const createGradeSchema = z.object({
  notifyParents: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
  termId: z.string().min(1),
  subjectId: z.string().min(1),
  weight: z.coerce.number().nonnegative(),
  name: z.string().min(1),
  scale: z.coerce.number().nonnegative(),
  grades: z.array(
    z.object({
      studentId: z.string(),
      absent: z.boolean().default(false),
      grade: z.string().default(""),
    }),
  ),
});

export function CreateGradeSheet({
  students,
}: {
  students: RouterOutputs["classroom"]["students"];
}) {
  const { t } = useLocale();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, rowIndex: number) => {
      if (event.key === "ArrowDown") {
        if (rowIndex < inputRefs.current.length - 1) {
          inputRefs.current[rowIndex + 1]?.focus();
        }
      } else if (event.key === "ArrowUp") {
        if (rowIndex > 0) {
          inputRefs.current[rowIndex - 1]?.focus();
        }
      }
    },
    [], // No dependencies, so this function is only created once
  );
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(createGradeSchema),
    defaultValues: {
      notifyParents: true,
      notifyStudents: true,
      termId: searchParams.get("term") ?? "",
      subjectId: searchParams.get("subject") ?? "",
      weight: 100,
      name: t("harmonized_grade"),
      scale: 20,
      grades: students.map((student) => ({
        studentId: student.id,
        absent: false,
        grade: "",
      })),
    },
  });
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createGradesheetMutation = useMutation(
    trpc.gradeSheet.create.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.gradeSheet.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        router.push(
          routes.classrooms.gradesheets.details(params.id, result.id),
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createGradeSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    const values = {
      ...data,
      termId: Number(data.termId),
      subjectId: Number(data.subjectId),
      grades: data.grades.map((grade) => ({
        ...grade,
        grade: isNaN(Number(grade.grade)) ? undefined : Number(grade.grade),
      })),
    };
    createGradesheetMutation.mutate(values);
  };
  const params = useParams<{ id: string }>();

  const { createQueryString } = useCreateQueryString();

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid px-2 flex-row gap-2 border-b md:flex">
          <div className="grid w-[75%] grid-cols-1 items-center gap-x-4 gap-y-2 border-r p-2 md:grid-cols-2">
            <FormField
              control={form.control}
              name="termId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{t("term")} </FormLabel>
                  <FormControl>
                    <TermSelector {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel>{t("subject")}</FormLabel>
                  <FormControl>
                    <SubjectSelector
                      onChange={field.onChange}
                      classroomId={params.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("grade_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("scale")}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"weight"}
                render={({ field }) => (
                  <FormItem className={cn("space-y-0")}>
                    <FormLabel>{t("weight")} (0-100)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 py-2">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="notifyParents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t("notify_parents")}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notifyStudents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t("notify_students")}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  router.push(
                    routes.classrooms.gradesheets.index(params.id) +
                      "?" +
                      createQueryString({}),
                  );
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                isLoading={createGradesheetMutation.isPending}
                type="submit"
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[10px]"></TableHead>
                  <TableHead className="w-[10px]"></TableHead>
                  <TableHead>{t("lastName")}</TableHead>
                  <TableHead>{t("firstName")}</TableHead>
                  <TableHead>{t("grade")}</TableHead>
                  <TableHead>{t("absence")}</TableHead>
                  <TableHead>{t("appreciation")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((st, index) => {
                  return (
                    <TableRow
                      key={st.id}
                      className="hover:bg-green-50 hover:text-green-700 hover:ring-green-600/20 dark:hover:bg-green-700/10 dark:hover:text-green-50"
                    >
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>
                        <AvatarState
                          avatar={st.user?.avatar}
                          pos={getFullName(st).length}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {getFullName(st)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {st.firstName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={st.id}
                          className="hidden"
                          {...form.register(`grades.${index}.studentId`)}
                        />
                        <FormField
                          control={form.control}
                          name={`grades.${index}.grade`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={6}
                                  size={6}
                                  // step=".01"
                                  // type="number"

                                  className="h-8 w-[150px] text-sm"
                                  ref={(el) => {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    inputRefs.current[index] = el!; // TODO: Fix this shouldn't use null assession
                                  }}
                                  onKeyDown={(event) =>
                                    handleKeyDown(event, index)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`grades.${index}.absent`}
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <Checkbox
                                  defaultChecked={true}
                                  checked={
                                    form.watch(`grades.${index}.grade`)
                                      ? false
                                      : true
                                  }
                                  onCheckedChange={(checked: boolean) => {
                                    console.log("checked change", checked);
                                    field.onChange(checked);
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {/* {watchValue.grade && getAppreciations(Number(watchValue.grade))} */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </form>
    </Form>
  );
}
