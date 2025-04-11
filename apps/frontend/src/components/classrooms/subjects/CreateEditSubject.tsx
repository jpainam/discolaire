"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CourseSelector } from "~/components/shared/selects/CourseSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import rangeMap from "~/lib/range-map";
import { useTRPC } from "~/trpc/react";
import { SelectField } from "../../shared/forms/SelectField";

const createEditSubjectSchema = z.object({
  courseId: z.string().min(1),
  teacherId: z.string().min(1),
  subjectGroupId: z.string().min(1),
  coefficient: z.string().min(1),
  order: z.coerce.number().default(1),
});

type Subject = NonNullable<RouterOutputs["classroom"]["subjects"][number]>;

export function CreateEditSubject({ subject }: { subject?: Subject }) {
  const { t } = useLocale();
  const { closeSheet } = useSheet();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createEditSubjectSchema),
    defaultValues: {
      courseId: subject?.courseId.toString() ?? "",
      teacherId: subject?.teacherId?.toString() ?? "",
      subjectGroupId: subject?.subjectGroupId?.toString() ?? "",
      coefficient: subject?.coefficient.toString() ?? "",
      order: subject?.order ?? 1,
    },
  });

  const subjectGroupsQuery = useQuery(trpc.subjectGroup.all.queryOptions());
  const subjectCreateMutation = useMutation(
    trpc.subject.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter()
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    })
  );
  const subjectUpdateMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter()
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    })
  );

  const onSubmit = (data: z.infer<typeof createEditSubjectSchema>) => {
    const formValues = {
      courseId: data.courseId,
      teacherId: data.teacherId,
      classroomId: params.id,
      subjectGroupId: Number(data.subjectGroupId),
      order: Number(data.order),
      coefficient: Number(data.coefficient),
    };
    if (subject) {
      toast.loading(t("updating"), { id: 0 });
      subjectUpdateMutation.mutate({ id: subject.id, ...formValues });
    } else {
      toast.loading(t("creating"), { id: 0 });
      subjectCreateMutation.mutate(formValues);
    }
  };

  const coeffs = rangeMap(10, (i) => ({
    value: i.toString(),
    label: i.toString(),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid h-full grid-cols-1 gap-6 p-2">
          <FormField
            control={form.control}
            name={"courseId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("course")}</FormLabel>
                <FormControl>
                  <CourseSelector
                    defaultValue={subject?.courseId ?? undefined}
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
                    defaultValue={subject?.teacherId ?? undefined}
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
            inputClassName="w-full"
            name="coefficient"
            items={coeffs}
          />

          {subjectGroupsQuery.isPending ? (
            <Skeleton className="h-10" />
          ) : (
            <SelectField
              label={t("group")}
              inputClassName="w-full"
              name="subjectGroupId"
              placeholder={t("select_an_option")}
              items={
                subjectGroupsQuery.data?.map((group) => ({
                  label: group.name,
                  value: group.id.toString(),
                })) ?? []
              }
              description={t("subject_group_description")}
            />
          )}
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("order")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("subject_order")}
                    {...field}
                    defaultValue={subject?.order.toString()}
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  {t("subject_order_description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
