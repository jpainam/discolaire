"use client";

import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const createCourseSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  reportName: z.string().min(1),
  isActive: z.boolean().default(true),
});
export function CreateEditCourse({
  course,
}: {
  course?: RouterOutputs["course"]["all"][number];
}) {
  const form = useForm({
    schema: createCourseSchema,
    defaultValues: {
      name: course?.name ?? "",
      shortName: course?.shortName ?? "",
      reportName: course?.reportName ?? "",
      isActive: course?.isActive ?? true,
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const createCourseMutation = api.course.create.useMutation({
    onSettled: () => utils.course.invalidate(),
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const updateCourseMutation = api.course.update.useMutation({
    onSettled: () => utils.course.invalidate(),
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createCourseSchema>) => {
    const values = {
      name: data.name,
      shortName: data.shortName,
      reportName: data.reportName,
      isActive: data.isActive,
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
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createCourseMutation.isPending || updateCourseMutation.isPending
            }
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
