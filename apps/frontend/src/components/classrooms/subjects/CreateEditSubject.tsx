"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { useSheet } from "@repo/lib/hooks/use-sheet";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";

import { CourseSelector } from "~/components/shared/selects/CourseSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { getErrorMessage } from "~/lib/handle-error";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";
import { SelectField } from "../../shared/forms/SelectField";

const createEditSubjectSchema = z.object({
  courseId: z.string().min(1),
  teacherId: z.string().min(1),
  subjectGroupId: z.string().min(1),
  coefficient: z.string().min(0),
  order: z.string().min(1).optional(),
});
type CreateEditSubjectValue = z.infer<typeof createEditSubjectSchema>;

export function CreateEditSubject({ subject }: { subject?: Subject }) {
  const { t } = useLocale();
  const { closeSheet } = useSheet();
  const form = useForm<CreateEditSubjectValue>({
    defaultValues: {
      courseId: subject?.courseId?.toString() || "",
      teacherId: subject?.teacherId?.toString() || "",
      subjectGroupId: subject?.subjectGroupId?.toString() || "",
      coefficient: subject?.coefficient?.toString() || "",
      order: subject?.order?.toString() || "",
    },
    resolver: zodResolver(createEditSubjectSchema),
  });

  const subjectGroupsQuery = api.subjectGroup.all.useQuery();
  const subjectCreateMutation = api.subject.create.useMutation();
  const subjectUpdateMutation = api.subject.update.useMutation();

  const params = useParams() as { id: string };

  const onSubmit = (data: CreateEditSubjectValue) => {
    const formValues = {
      courseId: data.courseId,
      teacherId: data.teacherId,
      classroomId: params.id as string,
      subjectGroupId: Number(data.subjectGroupId),
      order: Number(data.order),
      coefficient: Number(data.coefficient),
    };
    if (subject) {
      toast.promise(
        subjectUpdateMutation.mutateAsync({ id: subject.id, ...formValues }),
        {
          success: () => {
            closeSheet();
            return t("updated_successfully");
          },
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
        },
      );
    } else {
      toast.promise(subjectCreateMutation.mutateAsync(formValues), {
        success: () => {
          closeSheet();
          return t("created_successfully");
        },
        loading: t("creating"),
        error: (error) => {
          return getErrorMessage(error);
        },
      });
    }
  };

  const coeffs = rangeMap(10, (i) => ({
    value: i.toString(),
    label: i.toString(),
  }));
  const orders = rangeMap(10, (i) => ({
    value: i.toString(),
    label: i.toString(),
  }));
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid h-full grid-cols-1 gap-4 p-2">
          <FormField
            control={form.control}
            name={"courseId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("course")}</FormLabel>
                <FormControl>
                  <CourseSelector
                    defaultValue={subject?.courseId || undefined}
                    onChange={field.onChange}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"teacherId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("teacher")}</FormLabel>
                <FormControl>
                  <StaffSelector
                    defaultValue={subject?.teacherId || undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SelectField
            placeholder={t("select_an_option")}
            label={t("coefficient")}
            name="coefficient"
            items={coeffs}
          />
          <Separator />
          {subjectGroupsQuery.isPending ? (
            <Skeleton className="h-10" />
          ) : (
            <SelectField
              label={t("group")}
              name="subjectGroupId"
              placeholder={t("select_an_option")}
              items={
                subjectGroupsQuery?.data?.map((group) => ({
                  label: group.name,
                  value: group.id.toString(),
                })) || []
              }
              description={t("subject_group_description")}
            />
          )}
          <SelectField
            label={t("order")}
            description={t("subject_order_description")}
            name="order"
            placeholder={t("subject_order")}
            items={orders}
          />
        </div>
        <div className="flex flex-row items-end justify-end gap-2 px-2 py-4">
          <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {subject ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
