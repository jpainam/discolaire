"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Checkbox } from "@repo/ui/checkbox";
import { Form, useForm } from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
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
      grade: z.coerce.number().nonnegative(),
    }),
  ),
});

export function CreateGradeSheet() {
  const { t } = useLocale();
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
      toast.success("created_successfully", { id: 0 });
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
        grade: Number(grade.grade),
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

        <div className="mb-8=10 mx-2 w-full rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("grade")}</TableHead>
                <TableHead>{t("absence")}</TableHead>
                <TableHead>{t("appreciation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classroomStudentsQuery.isPending && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="grid w-full grid-cols-3 gap-4 px-2">
                      {Array.from({ length: 30 }).map((_, index) => (
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
                    <TableCell className="py-0">
                      <div className="flex flex-row items-center gap-1">
                        <AvatarState
                          avatar={st.avatar}
                          pos={getFullName(st).length}
                        />

                        <span>{index + 1}.</span>
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {getFullName(st)}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="py-0">
                      <Input
                        value={st.id}
                        className="hidden"
                        {...form.register(`grades.${index}.studentId`)}
                      />
                      <Input
                        {...form.register(`grades.${index}.grade`)}
                        maxLength={6}
                        size={6}
                        // step=".01"
                        // type="number"
                        className="h-8 w-[150px] text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-0">
                      <Checkbox
                        onCheckedChange={(checked: boolean) => {
                          form.setValue(`grades.${index}.absent`, checked);
                        }}
                      />
                    </TableCell>
                    <TableCell className="py-0">
                      {/* {watchValue.grade && getAppreciations(Number(watchValue.grade))} */}
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
