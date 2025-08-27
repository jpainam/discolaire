"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveIcon, XIcon } from "lucide-react";
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
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export function CreateUpdateJournal({
  item,
}: {
  item?: RouterOutputs["accountingJournal"]["stats"][number];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
    },
  });
  const trpc = useTRPC();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const createAccountingJournal = useMutation(
    trpc.accountingJournal.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accountingJournal.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.accountingJournal.stats.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateAccountingJournal = useMutation(
    trpc.accountingJournal.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accountingJournal.all.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.accountingJournal.stats.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      name: values.name,
      description: values.description,
    };
    if (item?.id) {
      updateAccountingJournal.mutate({
        id: item.id,
        ...data,
      });
    } else {
      createAccountingJournal.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Label")} {...field} />
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
                <Textarea
                  className="resize-none"
                  placeholder={t("description")}
                  {...field}
                />
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
            variant={"secondary"}
            type="button"
          >
            <XIcon className="h-3 w-3" />
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createAccountingJournal.isPending ||
              updateAccountingJournal.isPending
            }
            size="sm"
            type="submit"
          >
            <SaveIcon className="h-3 w-3" />
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
