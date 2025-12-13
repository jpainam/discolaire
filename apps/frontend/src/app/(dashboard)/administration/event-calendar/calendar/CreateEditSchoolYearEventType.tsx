"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { SubmitButton } from "~/components/SubmitButton";
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
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const schema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
});
export function CreateEditSchoolYearEventType({
  id,
  name,
  color,
}: {
  id?: string;
  name?: string;
  color?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: name ?? "",
      color: color ?? "#F4E4E7",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createSchoolYearEventTypeMutation = useMutation(
    trpc.schoolYearEvent.createEventType.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYearEvent.pathFilter());
        toast.success(t("Success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateSchoolYearEventTypeMutation = useMutation(
    trpc.schoolYearEvent.updateEventType.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYearEvent.pathFilter());
        toast.success(t("Success"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    toast.loading(t("loading"), { id: 0 });
    if (id) {
      updateSchoolYearEventTypeMutation.mutate({
        name: data.name,
        id: id,
        color: data.color,
      });
    } else {
      createSchoolYearEventTypeMutation.mutate({
        name: data.name,
        color: data.color,
      });
    }
  };

  const t = useTranslations();
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Label")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Color")}</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            type="button"
            variant={"secondary"}
          >
            {t("close")}
          </Button>
          <SubmitButton
            size="sm"
            isSubmitting={createSchoolYearEventTypeMutation.isPending}
          >
            {t("submit")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
