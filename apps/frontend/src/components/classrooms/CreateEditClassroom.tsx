"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";

import { api } from "~/trpc/react";
import { InputField } from "../shared/forms/input-field";
import { SelectField } from "../shared/forms/SelectField";
import { StaffSelector } from "../shared/selects/StaffSelector";

type ClassroomAllProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

type ClassroomGetProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["get"]
>;

export function CreateEditClassroom({
  classroom,
}: {
  classroom?: ClassroomAllProcedureOutput | ClassroomGetProcedureOutput;
}) {
  const { t } = useLocale();
  const updateClassroomSchema = z.object({
    name: z.string().trim().min(1),
    maxSize: z.coerce.number().int().positive(),
    cycleId: z.string().min(1),
    sectionId: z.string().min(1),
    reportName: z.string().trim().min(1),
    levelId: z.string().min(1),
    seniorAdvisorId: z.string().min(1),
    headTeacherId: z.string().min(1),
  });
  type UpdateClassroomValues = z.infer<typeof updateClassroomSchema>;

  const { data: levels } = api.classroomLevel.all.useQuery();
  const { data: cycles } = api.classroomCycle.all.useQuery();
  const { data: sections } = api.classroomSection.all.useQuery();

  const form = useForm<UpdateClassroomValues>({
    resolver: zodResolver(updateClassroomSchema),
    defaultValues: {
      name: classroom?.name ?? "",
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
  const router = useRouter();

  const updateClassroomMutation = api.classroom.update.useMutation({
    onSettled: async () => {
      await utils.classroom.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeSheet();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createClassroomMutation = api.classroom.create.useMutation({
    onSettled: async () => {
      await utils.classroom.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeSheet();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const utils = api.useUtils();

  function onSubmit(data: UpdateClassroomValues) {
    const values = {
      ...data,
      cycleId: data.cycleId,
      levelId: data.levelId,
      sectionId: data.sectionId,
    };
    if (classroom?.id) {
      toast.loading(t("updating"), { id: 0 });
      updateClassroomMutation.mutate({ id: classroom.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createClassroomMutation.mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-10rem)] items-start overflow-y-auto">
          <div className="grid gap-4 p-2 md:grid-cols-2">
            <InputField label={t("class_name_report")} name="reportName" />
            <InputField label={t("class_name")} name="name" />
            <InputField type="number" label={t("max_size")} name="maxSize" />

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

            <FormField
              control={form.control}
              name={"seniorAdvisorId"}
              render={({ field }) => (
                <FormItem className="space-y-0">
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
                <FormItem className="space-y-0">
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
