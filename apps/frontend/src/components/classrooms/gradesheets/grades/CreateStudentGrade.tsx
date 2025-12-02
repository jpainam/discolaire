"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createGradeStudentSchema = z.object({
  grade: z.coerce.number(),
  isAbsent: z.coerce.boolean(),
});

export function CreateStudentGrade({
  studentId,
  gradeSheetId,
}: {
  studentId: string;
  gradeSheetId: number;
}) {
  const form = useForm({
    resolver: zodResolver(createGradeStudentSchema),
    defaultValues: {
      isAbsent: false,
      grade: 0,
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createGradeMutation = useMutation(
    trpc.grade.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroom.gradesheets.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.gradeSheet.grades.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createGradeStudentSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createGradeMutation.mutate({
      grade: data.grade,
      gradeSheetId: gradeSheetId,
      studentId: studentId,
      isAbsent: data.isAbsent,
    });
  };

  const t = useTranslations();
  const { closeModal } = useModal();

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("grade")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"isAbsent"}
            render={({ field }) => (
              <FormItem
                className={"flex flex-row items-start space-y-0 space-x-2"}
              >
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>{t("absent")}</FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />
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
            isLoading={createGradeMutation.isPending}
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
