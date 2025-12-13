"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { SheetClose, SheetFooter } from "~/components/ui/sheet";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { InputField } from "../shared/forms/input-field";
import { SelectField } from "../shared/forms/SelectField";
import { StaffSelector } from "../shared/selects/StaffSelector";

type ClassroomAllProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

export function CreateEditClassroom({
  classroom,
}: {
  classroom?: ClassroomAllProcedureOutput;
}) {
  const t = useTranslations();
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

  const trpc = useTRPC();
  const { data: levels } = useQuery(trpc.classroomLevel.all.queryOptions());
  const { data: cycles } = useQuery(trpc.classroomCycle.all.queryOptions());
  const { data: sections } = useQuery(trpc.classroomSection.all.queryOptions());

  const form = useForm({
    resolver: standardSchemaResolver(updateClassroomSchema),
    defaultValues: {
      name: classroom?.name ?? "",
      maxSize: classroom?.maxSize ?? 0,
      cycleId: classroom?.cycleId?.toString() ?? "",
      reportName: classroom?.reportName ?? "",
      sectionId: classroom?.sectionId?.toString() ?? "",
      levelId: classroom?.levelId.toString() ?? "",
      seniorAdvisorId: classroom?.seniorAdvisorId ?? "",
      headTeacherId: classroom?.headTeacherId ?? "",
    },
  });

  const { closeSheet } = useSheet();

  const queryClient = useQueryClient();

  const updateClassroomMutation = useMutation(
    trpc.classroom.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const createClassroomMutation = useMutation(
    trpc.classroom.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  function onSubmit(data: z.infer<typeof updateClassroomSchema>) {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
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
            inputClassName="w-full"
            items={cycles?.map((l) => ({
              label: l.name,
              value: l.id.toString(),
            }))}
          />
          <SelectField
            label={t("section")}
            inputClassName="w-full"
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
                  onSelect={field.onChange}
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
                  onSelect={field.onChange}
                  defaultValue={field.value || ""}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SheetFooter>
          <Button
            size={"sm"}
            variant={"default"}
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {classroom ? t("edit") : t("submit")}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline" size={"sm"}>
              {t("cancel")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
