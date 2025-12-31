"use client";

import { useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const createGradeSchema = z.object({
  //weight: z.coerce.number().nonnegative(),
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
  term,
}: {
  students: RouterOutputs["classroom"]["students"];
  term: RouterOutputs["term"]["all"][number];
  subjectId: number;
  termId: string;
  className?: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();

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
    resolver: standardSchemaResolver(createGradeSchema),
    defaultValues: {
      //weight: 100,
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
      weight: 100,
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
      {!term.isActive && (
        <div className="mx-4 mb-2 rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
          <p className="text-sm">
            <TriangleAlert
              className="me-3 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("this_term_is_closed")}
          </p>
        </div>
      )}
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
          <div className="grid grid-cols-1 gap-4 p-1 px-4 md:grid-cols-4">
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

            {/* <FormField
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
            /> */}
            <div className="mt-4 grid grid-cols-2 items-center gap-2">
              <Button
                type="button"
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
                {t("cancel")}
              </Button>
              <Button
                disabled={!term.isActive || createGradesheetMutation.isPending}
                className="w-fit"
                type="submit"
              >
                {createGradesheetMutation.isPending && <Spinner />}

                {t("submit")}
              </Button>
            </div>
          </div>

          <div className="bg-background overflow-hidden border-y text-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[10px]"></TableHead>
                  <TableHead>{t("fullName")}</TableHead>
                  <TableHead>{t("grade")}</TableHead>
                  <TableHead>{t("absence")}</TableHead>
                  <TableHead>{t("appreciation")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((st, index) => {
                  return (
                    <TableRow key={st.id}>
                      <TableCell className="py-0">{index + 1}.</TableCell>
                      <TableCell className="py-0">
                        <UserLink
                          profile="student"
                          id={st.id}
                          avatar={st.avatar}
                          name={getFullName(st)}
                        />
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
                                    // eslint-disable-next-line react-hooks/incompatible-library
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
