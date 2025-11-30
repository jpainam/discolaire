"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";
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

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  dosage: z.string().min(1),
});
export function CreateEditDrug({
  studentId,
  drug,
}: {
  drug?: RouterOutputs["health"]["drugs"][number];
  studentId: string;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      name: drug?.name ?? "",
      description: drug?.description ?? "",
      dosage: drug?.dosage ?? "",
    },
  });
  const { closeModal } = useModal();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createDrug = useMutation(
    trpc.health.createDrug.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.drugs.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const updateDrug = useMutation(
    trpc.health.updateDrug.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.drugs.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (drug) {
      toast.loading(t("updating"), { id: 0 });
      void updateDrug.mutate({
        name: data.name,
        dosage: data.dosage,
        description: data.description,
        id: drug.id,
      });
    } else {
      toast.loading(t("creating"), { id: 0 });
      void createDrug.mutate({
        studentId: studentId,
        ...data,
      });
    }
  };

  const t = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6">
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dosage")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-6">
            <Button
              onClick={() => {
                closeModal();
              }}
              variant={"outline"}
              type="button"
            >
              {t("cancel")}
            </Button>
            <Button
              isLoading={createDrug.isPending || updateDrug.isPending}
              type="submit"
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
