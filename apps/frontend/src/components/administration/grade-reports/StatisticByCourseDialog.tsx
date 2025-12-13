"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  courseId: z.string().min(1),
  termId: z.string().min(1),
});
export function StatisticByCourseDialog({ format }: { format: "pdf" | "csv" }) {
  const form = useForm({
    defaultValues: {
      courseId: "",
      termId: "",
    },
    resolver: standardSchemaResolver(schema),
  });
  const trpc = useTRPC();
  const courseQuery = useQuery(trpc.course.used.queryOptions());

  const t = useTranslations();
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof schema>) => {
    window.open(
      `/api/pdfs/gradereports/statistics-by-course?courseId=${data.courseId}&termId=${data.termId}&format=${format}`,
      "_blank",
    );
    closeModal();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("course")}</FormLabel>
              <FormControl>
                <>
                  {courseQuery.isLoading ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("course")} />
                      </SelectTrigger>
                      <SelectContent>
                        {courseQuery.data?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="termId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("term")}</FormLabel>
              <FormControl>
                <TermSelector onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            type="button"
            size={"sm"}
            variant={"secondary"}
            onClick={() => {
              closeModal();
            }}
          >
            {t("close")}
          </Button>
          <Button size={"sm"}>{t("Generate Report")}</Button>
        </div>
      </form>
    </Form>
  );
}
