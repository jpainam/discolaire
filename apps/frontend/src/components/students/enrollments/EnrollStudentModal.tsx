"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";

import { InputField } from "~/components/shared/forms/input-field";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

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
    resolver: standardSchemaResolver(enrollFormSchema),
  });
  const { t } = useLocale();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createEnrollmentMutation = useMutation(
    trpc.enrollment.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.pathFilter());
        toast.success(t("enrolled_successfully"), { id: 0 });

        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, {
          id: 0,
          position: "top-center",
          duration: 5000,
          className: "w-[300px]",
        });
        //toast.error(error.message, { id: 0 });
      },
    }),
  );

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
                <ClassroomSelector
                  defaultValue={field.value}
                  onSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <InputField name="observation" label={t("Observation")} />

        <div className="ml-auto flex flex-row gap-4">
          <Button
            size={"sm"}
            type="button"
            onClick={() => {
              closeModal();
            }}
            variant="outline"
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={createEnrollmentMutation.isPending}
            type="submit"
          >
            {t("enroll")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
