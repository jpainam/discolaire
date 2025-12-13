"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

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

const createEditSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditSection({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditSchema),
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createSectionMutation = useMutation(
    trpc.classroomSection.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomSection.all.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateSectionMutation = useMutation(
    trpc.classroomSection.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.classroomSection.all.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const handleSubmit = (data: z.infer<typeof createEditSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateSectionMutation.mutate({ id: id, name: data.name });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createSectionMutation.mutate(data);
    }
  };

  const t = useTranslations();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="ml-auto flex items-center gap-2">
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
            isLoading={
              createSectionMutation.isPending || updateSectionMutation.isPending
            }
            type="submit"
            size={"sm"}
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
