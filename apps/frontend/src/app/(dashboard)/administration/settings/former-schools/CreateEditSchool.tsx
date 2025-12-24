"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decode } from "entities";
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
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const createSchoolSchema = z.object({
  name: z.string().min(1),
});
export function CreateEditSchool({ id, name }: { id?: string; name?: string }) {
  const form = useForm({
    resolver: standardSchemaResolver(createSchoolSchema),
    defaultValues: {
      name: name ? decode(name) : "",
    },
  });
  const { closeModal } = useModal();

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createSchoolMutation = useMutation(
    trpc.formerSchool.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.formerSchool.all.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateSchoolMutation = useMutation(
    trpc.formerSchool.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.formerSchool.all.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createSchoolSchema>) => {
    if (id) {
      toast.loading(t("updating"), { id: 0 });
      updateSchoolMutation.mutate({
        id: id,
        name: data.name,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createSchoolMutation.mutate({ name: data.name });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center justify-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            disabled={
              createSchoolMutation.isPending || updateSchoolMutation.isPending
            }
            variant={"default"}
          >
            {(createSchoolMutation.isPending ||
              updateSchoolMutation.isPending) && <Spinner />}
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
