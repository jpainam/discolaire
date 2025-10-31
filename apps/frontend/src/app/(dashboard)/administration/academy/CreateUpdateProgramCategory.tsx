"use client";

import { useRouter } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  title: z.string().min(1),
});

export function CreateUpdateProgramCategory({
  category,
}: {
  category?: RouterOutputs["program"]["categories"][number];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      title: category?.title ?? "",
    },
  });
  const t = useTranslations();
  const { closeModal } = useModal();
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createCategory = useMutation(
    trpc.program.createCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.categories.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        router.refresh(); // to update the random color
        closeModal();
      },
    }),
  );
  const updateCategory = useMutation(
    trpc.program.updateCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.categories.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      title: values.title,
    };
    if (category) {
      updateCategory.mutate({
        id: category.id,
        ...data,
      });
    } else {
      createCategory.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-5"
      >
        <FormField
          control={form.control}
          name="title"
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

        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            size="sm"
            variant="secondary"
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={createCategory.isPending || updateCategory.isPending}
            size="sm"
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
