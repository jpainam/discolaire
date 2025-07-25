"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";

import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { InputField } from "~/components/shared/forms/input-field";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

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
    resolver: zodResolver(editGradeStudentSchema),
    defaultValues: {
      isAbsent: false,
      studentId: studentId,
      grade: grade,
      gradeId: gradeId,
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const updateGradeMutation = useMutation(
    trpc.grade.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.gradeSheet.grades.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

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
          <CheckboxField name="isAbsent" label={t("absent")} />
        </div>
        <div className="mt-4 ml-auto flex flex-row gap-4">
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
