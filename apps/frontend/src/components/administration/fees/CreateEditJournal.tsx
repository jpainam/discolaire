"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Journal } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useMutation } from "@tanstack/react-query";
import { InputField } from "~/components/shared/forms/input-field";
import { getErrorMessage } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";

const journalSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
export function CreateEditJournal({ journal }: { journal?: Journal }) {
  const { closeModal } = useModal();
  const form = useForm<z.infer<typeof journalSchema>>({
    defaultValues: {
      name: journal?.name ?? "",
      description: journal?.description ?? "",
    },
    resolver: zodResolver(journalSchema),
  });
  const { t } = useLocale();
  const trpc = useTRPC();
  const addJournalMutation = useMutation(trpc.journal.create.mutationOptions());
  const updateJournalMutation = useMutation(
    trpc.journal.update.mutationOptions(),
  );

  const onSubmit = (data: z.infer<typeof journalSchema>) => {
    if (!journal) {
      toast.promise(addJournalMutation.mutateAsync(data), {
        loading: t("adding"),
        success: () => {
          closeModal();
          return t("added_successfully");
        },
        error: (error) => {
          return getErrorMessage(error);
        },
      });
    } else {
      toast.promise(
        updateJournalMutation.mutateAsync({ id: journal.id, ...data }),
        {
          loading: t("updating"),
          success: () => {
            closeModal();
            return t("updated_successfully");
          },
          error: (error) => {
            return getErrorMessage(error);
          },
        },
      );
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 px-4"
      >
        <InputField label={t("name")} name="name" />
        <InputField label={t("description")} name="description" />
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button type="submit">{t("submit")}</Button>
        </div>
      </form>
    </Form>
  );
}
