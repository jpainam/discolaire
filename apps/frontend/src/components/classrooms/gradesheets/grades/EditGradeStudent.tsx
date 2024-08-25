"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { InputField } from "~/components/shared/forms/input-field";
import { useLocale } from "~/hooks/use-locale";
import { useModal } from "~/hooks/use-modal";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const editGradeStudentSchema = z.object({
  studentId: z.string().min(1),
  gradeId: z.coerce.number(),
  grade: z.coerce.number(),
  isAbsent: z.coerce.boolean(),
});
type EditGradeStudentValue = z.infer<typeof editGradeStudentSchema>;

export function EditGradeStudent({
  studentId,
  grade,
  gradeId,
}: {
  studentId: string;
  grade: number;
  gradeId: number;
}) {
  const form = useForm<EditGradeStudentValue>({
    resolver: zodResolver(editGradeStudentSchema),
    defaultValues: {
      studentId: studentId,
      grade: grade,
      gradeId: gradeId,
    },
  });
  const updateGradeMutation = api.grade.update.useMutation();
  const utils = api.useUtils();
  const onSubmit = async (data: EditGradeStudentValue) => {
    toast.promise(
      updateGradeMutation.mutateAsync({
        grade: data.grade,
        id: Number(data.gradeId),
        isAbsent: data.isAbsent,
      }),
      {
        loading: t("updating"),
        success: () => {
          utils.grade.invalidate();
          utils.gradeSheet.invalidate();
          closeModal();
          return t("updated");
        },
        error: (error) => {
          closeModal();
          return getErrorMessage(error);
        },
      },
    );
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
          <CheckboxField name="isAbsent" label={t("isAbsent")} />
        </div>
        <div className="ml-auto mt-4 flex flex-row gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
