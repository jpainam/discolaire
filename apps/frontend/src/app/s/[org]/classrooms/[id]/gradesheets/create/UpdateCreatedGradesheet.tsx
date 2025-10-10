"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@repo/ui/components/button";
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

const schema = z.object({
  title: z.string().min(1),
  scale: z.coerce.number().min(1),
  weight: z.coerce.number().min(0).max(100),
});
export function UpdateCreatedGradesheet({
  title,
  gradeSheetId,
  scale,
  weight,
}: {
  title: string;
  gradeSheetId: number;
  scale: number;
  weight: number;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: title,
      scale: scale,
      weight: weight,
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const updateCreatedGradesheet = useMutation(
    trpc.gradeSheet.updateCreated.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.gradeSheet.pathFilter());
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCreatedGradesheet.mutate({
      id: gradeSheetId,
      title: data.title,
      scale: data.scale,
      weight: data.weight,
    });
  };
  const t = useTranslations();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("scale")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("weight")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            type="button"
            size="sm"
            variant={"secondary"}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={updateCreatedGradesheet.isPending}
            type="submit"
            size="sm"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
