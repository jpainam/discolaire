"use client";

import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form, useForm } from "@repo/ui/form";

import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { InputField } from "~/components/shared/forms/input-field";
import { api } from "~/trpc/react";

const editGradeStudentSchema = z.object({
  studentId: z.string().min(1),
  gradeId: z.coerce.number(),
  grade: z.coerce.number(),
  isAbsent: z.coerce.boolean(),
});

export function EditGradeStudent({
  studentId,
  grade,
  gradeId,
}: {
  studentId: string;
  grade: number;
  gradeId: number;
}) {
  const form = useForm({
    schema: editGradeStudentSchema,
    defaultValues: {
      studentId: studentId,
      grade: grade,
      gradeId: gradeId,
    },
  });
  const updateGradeMutation = api.grade.update.useMutation({
    onSettled: async () => {
      await utils.grade.invalidate();
      await utils.gradeSheet.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const utils = api.useUtils();
  const onSubmit = (data: z.infer<typeof editGradeStudentSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateGradeMutation.mutate({
      grade: data.grade,
      id: Number(data.gradeId),
      isAbsent: data.isAbsent,
    });
  };
  const { t } = useLocale();
  const { closeModal } = useModal();

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <InputField className="hidden" name="studentId" />
          <InputField className="hidden" name="gradeId" />
          <InputField name="grade" label={t("grade")} type="number" />
          <CheckboxField name="isAbsent" label={t("is_absent")} />
        </div>
        <div className="ml-auto mt-4 flex flex-row gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={updateGradeMutation.isPending}
            size={"sm"}
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
