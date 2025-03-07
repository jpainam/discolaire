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
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
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
import { useLocale } from "~/i18n";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { CreateGradeSheetHeader } from "./CreateGradeSheetHeader";

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
    })
  ),
});

export function CreateGradeSheet() {
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
    [] // No dependencies, so this function is only created once
  );
  const searchParams = useSearchParams();
  const form = useForm({
    schema: createGradeSchema,
    defaultValues: {
      notifyParents: true,
      notifyStudents: true,
      termId: searchParams.get("term") ?? "",
      subjectId: searchParams.get("subject") ?? "",
      weight: 100,
      name: t("harmonized_grade"),
      scale: 20,
    },
  });
  const router = useRouter();
  const utils = api.useUtils();
  const createGradesheetMutation = api.gradeSheet.create.useMutation({
    onSettled: async () => {
      await utils.gradeSheet.invalidate();
    },
    onSuccess: (result) => {
      toast.success(t("created_successfully"), { id: 0 });
      router.push(routes.classrooms.gradesheets.details(params.id, result.id));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
  const classroomStudentsQuery = api.classroom.students.useQuery(params.id);

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CreateGradeSheetHeader
          isSubmitting={createGradesheetMutation.isPending}
        />
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
                {classroomStudentsQuery.isPending && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="grid w-full grid-cols-4 gap-4 px-2">
                        {Array.from({ length: 40 }).map((_, index) => (
                          <Skeleton
                            key={`gradesheet-table-${index}`}
                            className="h-8 w-full"
                          />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {classroomStudentsQuery.data?.map((st, index) => {
                  return (
                    <TableRow
                      key={st.id}
                      className="hover:bg-green-50 hover:text-green-700 hover:ring-green-600/20 dark:hover:bg-green-700/10 dark:hover:text-green-50"
                    >
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>
                        <AvatarState
                          avatar={st.avatar}
                          pos={getFullName(st).length}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {st.lastName}
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
