"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { inferProcedureOutput } from "@trpc/server";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "~/hooks/use-locale";
import { useSheet } from "~/hooks/use-sheet";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { InputField } from "../shared/forms/input-field";
import { SelectField } from "../shared/forms/SelectField";
import { StaffSelector } from "../shared/selects/StaffSelector";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type ClassroomAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["all"]>
>[number];

type ClassroomGetProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["get"]>
>;

export function CreateEditClassroom({
  classroom,
}: {
  classroom?: ClassroomAllProcedureOutput | ClassroomGetProcedureOutput;
}) {
  const { t } = useLocale();
  const updateClassroomSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t("this_field_is_required") }),
    shortName: z
      .string()
      .trim()
      .min(1, { message: t("this_field_is_required") }),
    maxSize: z.coerce.number().int().positive(t("must_be_a_positive_number")),
    cycleId: z.string().min(1, { message: t("this_field_is_required") }),
    sectionId: z.string().min(1, { message: t("this_field_is_required") }),
    reportName: z
      .string()
      .trim()
      .min(1, { message: t("this_field_is_required") }),
    levelId: z.string().min(1, { message: t("this_field_is_required") }),
    seniorAdvisorId: z
      .string()
      .min(1, { message: t("this_field_is_required") }),
    headTeacherId: z.string().min(1, { message: t("this_field_is_required") }),
  });
  type UpdateClassroomValues = z.infer<typeof updateClassroomSchema>;

  const { data: levels } = api.classroomLevel.all.useQuery();
  const { data: cycles } = api.classroomCycle.all.useQuery();
  const { data: sections } = api.classroomSection.all.useQuery();

  const form = useForm<UpdateClassroomValues>({
    resolver: zodResolver(updateClassroomSchema),
    defaultValues: {
      name: classroom?.name ?? "",
      shortName: classroom?.shortName ?? "",
      maxSize: classroom?.maxSize ?? 0,
      cycleId: classroom?.cycleId?.toString() ?? "",
      reportName: classroom?.reportName ?? "",
      sectionId: classroom?.sectionId?.toString() ?? "",
      levelId: classroom?.levelId?.toString() ?? "",
      seniorAdvisorId: classroom?.seniorAdvisorId ?? "",
      headTeacherId: classroom?.headTeacherId ?? "",
    },
  });

  const { closeSheet } = useSheet();

  const updateClassroomMutation = api.classroom.update.useMutation();
  const createClassroomMutation = api.classroom.create.useMutation();
  const utils = api.useUtils();

  function onSubmit(data: UpdateClassroomValues) {
    const values = {
      ...data,
      cycleId: parseInt(data.cycleId),
      levelId: parseInt(data.levelId),
      sectionId: parseInt(data.sectionId),
    };
    if (classroom?.id) {
      toast.promise(
        updateClassroomMutation.mutateAsync({ id: classroom.id, ...values }),
        {
          loading: t("updating"),
          error: (error) => {
            return getErrorMessage(error);
          },
          success: () => {
            utils.classroom.invalidate();
            return t("updated_successfully");
          },
        },
      );
    } else {
      toast.promise(createClassroomMutation.mutateAsync(values), {
        loading: t("creating"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: () => {
          utils.classroom.invalidate();
          return t("created_successfully");
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-10rem)] items-start overflow-y-auto">
          <div className="grid gap-x-4 p-2 md:grid-cols-2">
            <InputField label={t("class_name_short")} name="shortName" />
            <InputField label={t("class_name_report")} name="reportName" />
            <InputField label={t("class_name")} name="name" />
            <InputField type="number" label={t("max_size")} name="maxSize" />
            <Separator className="col-span-full" />
            <SelectField
              label={t("level")}
              placeholder={t("choose_class_level")}
              name="levelId"
              items={levels?.map((l) => ({
                label: l.name,
                value: l.id.toString(),
              }))}
            />
            <SelectField
              label={t("cycle")}
              placeholder={t("choose_class_cycle")}
              name="cycleId"
              items={cycles?.map((l) => ({
                label: l.name,
                value: l.id.toString(),
              }))}
            />
            <SelectField
              label={t("section")}
              placeholder={t("choose_class_section")}
              name="sectionId"
              items={sections?.map((l) => ({
                label: l.name,
                value: l.id.toString(),
              }))}
            />
            <Separator className="col-span-full my-2" />
            <FormField
              control={form.control}
              name={"seniorAdvisorId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("senior_advisor")}</FormLabel>
                  <StaffSelector
                    placeholder={t("choose_senior_advisor")}
                    onChange={field.onChange}
                    defaultValue={field.value || ""}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"headTeacherId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("head_teacher")}</FormLabel>
                  <StaffSelector
                    placeholder={t("choose_head_teacher")}
                    onChange={field.onChange}
                    defaultValue={field.value || ""}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="flex flex-row justify-end gap-4 p-2">
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={() => {
              closeSheet();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            variant={"default"}
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            {classroom ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
