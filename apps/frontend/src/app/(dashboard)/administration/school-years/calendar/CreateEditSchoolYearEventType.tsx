"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SubmitButton } from "~/components/SubmitButton";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
const schema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});
export function CreateEditSchoolYearEventType({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: name ?? "",
      color: "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createSchoolYearEventTypeMutation = useMutation(
    trpc.schoolYearEvent.createEventType.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYearEvent.pathFilter());
        toast.success(t("Success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const updateSchoolYearEventTypeMutation = useMutation(
    trpc.schoolYearEvent.updateEventType.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.schoolYearEvent.pathFilter());
        toast.success(t("Success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const handleSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateSchoolYearEventTypeMutation.mutate({
        name: data.name,
        color: data.color,
      });
    } else {
      createSchoolYearEventTypeMutation.mutate({
        name: data.name,
        color: data.color,
      });
    }
  };
  const { t } = useLocale();
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form className="grid grid-cols-1 gap-6">
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
              <FormLabel>{t("Label")}</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-end gap-2 items-center">
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
