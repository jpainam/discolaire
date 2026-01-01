"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createEditAppreciationSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  appreciation: z.string().min(1),
});
export function CreateEditGradeAppreciation({
  gradeAppreciation,
}: {
  gradeAppreciation?: RouterOutputs["gradeAppreciation"]["all"][number];
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditAppreciationSchema),
    defaultValues: {
      min: gradeAppreciation?.minGrade ?? 0,
      max: gradeAppreciation?.maxGrade ?? 0,
      appreciation: gradeAppreciation?.appreciation ?? "",
    },
  });

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const createAppreciation = useMutation(
    trpc.gradeAppreciation.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.gradeAppreciation.all.pathFilter(),
        );

        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const updateAppreciation = useMutation(
    trpc.gradeAppreciation.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.gradeAppreciation.all.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof createEditAppreciationSchema>) => {
    const values = {
      minGrade: data.min,
      maxGrade: data.max,
      appreciation: data.appreciation,
    };
    if (gradeAppreciation) {
      toast.loading(t("updating"), { id: 0 });
      updateAppreciation.mutate({
        id: gradeAppreciation.id,
        ...values,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createAppreciation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
        <div className="gap4 grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("min_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("max_grade")}</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="appreciation"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("appreciation")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row items-center justify-end gap-4">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
          >
            <XIcon />
            {t("cancel")}
          </Button>
          <Button
            disabled={
              createAppreciation.isPending || updateAppreciation.isPending
            }
            type="submit"
          >
            {(createAppreciation.isPending || updateAppreciation.isPending) && (
              <Spinner />
            )}

            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
