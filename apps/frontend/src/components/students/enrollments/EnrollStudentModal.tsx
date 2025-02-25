"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { useLocale } from "~/i18n";

import { InputField } from "~/components/shared/forms/input-field";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

const enrollFormSchema = z.object({
  classroomId: z.string().min(1),
  observation: z.string().optional(),
});

export function EnrollStudentModal({ studentId }: { studentId: string }) {
  const form = useForm({
    defaultValues: {
      classroomId: "",
      observation: "",
    },
    resolver: zodResolver(enrollFormSchema),
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  //const params = useParams<{ id: string }>();
  const router = useRouter();
  const createEnrollmentMutation = api.enrollment.create.useMutation({
    onSettled: async () => {
      await utils.student.invalidate();
    },
    onSuccess: () => {
      toast.success(t("enrolled_successfully"), { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const onSubmitEnrollment = (data: z.infer<typeof enrollFormSchema>) => {
    toast.loading(t("enrolling"), { id: 0 });
    createEnrollmentMutation.mutate({
      studentId: studentId,
      classroomId: data.classroomId,
      observation: data.observation ?? "",
    });
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
          <Button isLoading={createEnrollmentMutation.isPending} type="submit">
            {t("enroll")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
