"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createCourseSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  reportName: z.string().min(1),
  color: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});
export function CreateEditCourse({
  course,
}: {
  course?: RouterOutputs["course"]["all"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createCourseSchema),
    defaultValues: {
      name: course?.name ?? "",
      color: course?.color ?? "",
      shortName: course?.shortName ?? "",
      reportName: course?.reportName ?? "",
      isActive: course?.isActive ?? true,
    },
  });
  const { closeModal } = useModal();

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createCourseMutation = useMutation(
    trpc.course.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.course.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateCourseMutation = useMutation(
    trpc.course.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.course.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createCourseSchema>) => {
    const values = {
      name: data.name,
      shortName: data.shortName,
      reportName: data.reportName,
      isActive: data.isActive,
      color: data.color,
    };
    if (course?.id) {
      toast.loading(t("updating"), { id: 0 });
      updateCourseMutation.mutate({
        id: course.id,
        ...values,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createCourseMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-[20%_80%] gap-2">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("color")}</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("shortName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reportName"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("reportName")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("is_active")}?</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center justify-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={
              createCourseMutation.isPending || updateCourseMutation.isPending
            }
            variant={"default"}
          >
            {(createCourseMutation.isPending ||
              updateCourseMutation.isPending) && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
