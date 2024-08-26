"use client";

import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/form";

import { InputField } from "~/components/shared/forms/input-field";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const enrollFormSchema = z.object({
  classroomId: z.string().min(1),
  observation: z.string().optional(),
});
type EnrollFormValues = z.infer<typeof enrollFormSchema>;

export function EnrollStudentModal({ studentId }: { studentId: string }) {
  const form = useForm({
    defaultValues: {
      classroomId: "",
      observation: "",
    },
    resolver: zodResolver(enrollFormSchema),
  });
  const { t } = useLocale();
  const params = useParams();
  const createEnrollmentMutation = api.enrollment.create.useMutation();
  const utils = api.useUtils();

  const onSubmitEnrollment = (data: EnrollFormValues) => {
    toast.promise(
      createEnrollmentMutation.mutateAsync({
        studentId: studentId,
        classroomId: data.classroomId,
        observation: data.observation || "",
      }),
      {
        error: (error) => {
          closeModal();
          return getErrorMessage(error);
        },
        loading: t("enrolling"),
        success: async () => {
          await utils.student.invalidate();
          closeModal();
          return t("enrolled_successfully");
        },
      },
    );
  };
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmitEnrollment)}
      >
        <FormField
          control={form.control}
          name="classroomId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ClassroomSelector onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InputField name="observation" label={t("Observation")} />

        <div className="ml-auto flex flex-row gap-4">
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("enroll")}</Button>
        </div>
      </form>
    </Form>
  );
}
