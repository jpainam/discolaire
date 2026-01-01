"use client";

import { useParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { CourseSelector } from "~/components/shared/selects/CourseSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const createEditSubjectSchema = z.object({
  courseId: z.string().min(1),
  teacherId: z.string().min(1),
  subjectGroupId: z.string().min(1),
  coefficient: z.string().min(1),
  order: z.number().min(1),
});

type Subject = NonNullable<RouterOutputs["classroom"]["subjects"][number]>;

export function CreateEditSubject({ subject }: { subject?: Subject }) {
  const t = useTranslations();
  const { closeSheet } = useSheet();
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      courseId: subject?.courseId.toString() ?? "",
      teacherId: subject?.teacherId?.toString() ?? "",
      subjectGroupId: subject?.subjectGroupId?.toString() ?? "",
      coefficient: subject?.coefficient.toString() ?? "",
      order: subject?.order ?? 1,
    },
    validators: {
      onSubmit: createEditSubjectSchema,
    },
    onSubmit: ({ value }) => {
      const formValues = {
        courseId: value.courseId,
        teacherId: value.teacherId,
        classroomId: params.id,
        subjectGroupId: Number(value.subjectGroupId),
        order: Number(value.order),
        coefficient: Number(value.coefficient),
      };
      if (subject) {
        toast.loading(t("updating"), { id: 0 });
        subjectUpdateMutation.mutate({ id: subject.id, ...formValues });
      } else {
        toast.loading(t("creating"), { id: 0 });
        subjectCreateMutation.mutate(formValues);
      }
    },
  });

  const subjectGroupsQuery = useQuery(trpc.subjectGroup.all.queryOptions());
  const subjectCreateMutation = useMutation(
    trpc.subject.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );
  const subjectUpdateMutation = useMutation(
    trpc.subject.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.subjects.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );

  const coeffs = Array.from({ length: 10 }).map((_, i) => ({
    value: i.toString(),
    label: i.toString(),
  }));

  return (
    <div className="flex flex-col gap-4">
      <form
        id="create-subject-form"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <div className="grid h-full grid-cols-1 gap-6 p-2">
          <form.Field
            name="courseId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("course")}</FieldLabel>
                  <CourseSelector
                    defaultValue={field.state.value || undefined}
                    onChange={(value) => field.handleChange(value ?? "")}
                    className="w-full"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="teacherId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t("teacher")}</FieldLabel>
                  <StaffSelector
                    defaultValue={field.state.value}
                    onSelect={(value) => field.handleChange(value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="coefficient"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t("coefficient")}
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    aria-invalid={isInvalid}
                  >
                    <SelectTrigger className="w-full" id={field.name}>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                    <SelectContent>
                      {coeffs.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {subjectGroupsQuery.isPending ? (
            <Skeleton className="h-10" />
          ) : (
            <form.Field
              name="subjectGroupId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t("group")}</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      aria-invalid={isInvalid}
                    >
                      <SelectTrigger className="w-full" id={field.name}>
                        <SelectValue placeholder={t("select_an_option")} />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectGroupsQuery.data?.map((group) => (
                          <SelectItem
                            key={group.id}
                            value={group.id.toString()}
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-muted-foreground text-xs">
                      {t("subject_group_description")}
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          )}
          <form.Field
            name="order"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-0">
                  <FieldLabel htmlFor={field.name}>{t("order")}</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder={t("subject_order")}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.valueAsNumber;
                      field.handleChange(
                        Number.isNaN(nextValue) ? 0 : nextValue,
                      );
                    }}
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription className="text-muted-foreground text-xs">
                    {t("subject_order_description")}
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </div>
      </form>
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
        <Button type="submit" form="create-subject-form">
          {subject ? t("edit") : t("submit")}
        </Button>
      </div>
    </div>
  );
}
