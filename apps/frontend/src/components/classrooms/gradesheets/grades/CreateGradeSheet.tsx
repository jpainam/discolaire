"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
import { SaveIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const createGradeSchema = z.object({
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
  subjectId,
  termId,
  className,
}: {
  students: RouterOutputs["classroom"]["students"];
  subjectId: number;
  termId: string;
  className?: string;
}) {
  const { t } = useLocale();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setInputRef = useCallback((el: HTMLInputElement | null, i: number) => {
    inputRefs.current[i] = el;
  }, []);

  const moveFocus = (i: number, delta: number) => {
    const next = Math.min(Math.max(i + delta, 0), inputRefs.current.length - 1);
    const el = inputRefs.current[next];
    if (el) {
      el.focus();
      // optional: select content when focusing
      requestAnimationFrame(() => el.select());
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
      // prevent native number spin & form submit
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === "ArrowDown" || e.key === "Enter") {
        moveFocus(i, +1);
      } else if (e.key === "ArrowUp") {
        moveFocus(i, -1);
      }
    },
    [],
  );

  // (Optional) stop mouse wheel from changing number inputs
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).blur();
  };

  const form = useForm({
    resolver: zodResolver(createGradeSchema),
    defaultValues: {
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
      termId: termId,
      subjectId: subjectId,
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
    <div className={className}>
      <Form {...form}>
        <form
          className="flex w-full flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLElement).tagName !== "TEXTAREA" &&
              !(e.target as HTMLInputElement).type
                .toLowerCase()
                .includes("submit")
            ) {
              e.preventDefault(); // no implicit submit on Enter
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4 p-1 px-4 md:grid-cols-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel>{t("Label")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Label")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scale"
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel>{t("scale")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("scale")} type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"weight"}
              render={({ field }) => (
                <FormItem className="gap-1">
                  <FormLabel>{t("weight")} 0--100</FormLabel>
                  <FormControl>
                    <Input placeholder={t("weight")} {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 grid grid-cols-2 items-center gap-2">
              <Button
                type="button"
                size={"sm"}
                className="w-fit"
                variant={"outline"}
                onClick={() => {
                  router.push(
                    routes.classrooms.gradesheets.index(params.id) +
                      "?" +
                      createQueryString({}),
                  );
                }}
              >
                <XIcon />
                {t("cancel")}
              </Button>
              <Button
                size={"sm"}
                className="w-fit"
                isLoading={createGradesheetMutation.isPending}
                type="submit"
              >
                <SaveIcon />
                {t("submit")}
              </Button>
            </div>
          </div>

          <div className="bg-background overflow-hidden border-y text-xs">
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
                      <TableCell className="py-0">{index + 1}.</TableCell>
                      <TableCell className="py-0">
                        <AvatarState
                          className="h-5 w-5"
                          avatar={st.user?.avatar}
                          pos={getFullName(st).length}
                        />
                      </TableCell>
                      <TableCell className="py-0">
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {decode(st.lastName ?? "")}
                        </Link>
                      </TableCell>
                      <TableCell className="py-0">
                        <Link
                          className="hover:text-blue-600 hover:underline"
                          href={routes.students.details(st.id)}
                        >
                          {decode(st.firstName ?? "")}
                        </Link>
                      </TableCell>
                      <TableCell className="py-1">
                        <Input
                          value={st.id}
                          className="hidden"
                          autoComplete="off"
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
                                  autoComplete="off"
                                  inputMode="numeric"
                                  size={6}
                                  // step=".01"
                                  type="number"
                                  className="h-8 w-[150px] text-sm"
                                  ref={(el) => setInputRef(el, index)}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  onWheel={handleWheel}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="py-0">
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
    </div>
  );
}
