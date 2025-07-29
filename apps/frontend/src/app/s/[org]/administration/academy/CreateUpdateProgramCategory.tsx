"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { generateStringColor } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

const randColor = generateStringColor();
const formSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1),
});

export function CreateUpdateProgramCategory({
  category,
}: {
  category?: RouterOutputs["program"]["categories"][number];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: category?.title ?? "",
      color: category?.color ?? randColor,
    },
  });
  const t = useTranslations();
  const { closeModal } = useModal();

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
      color: values.color,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("color")}</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center gap-2">
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
