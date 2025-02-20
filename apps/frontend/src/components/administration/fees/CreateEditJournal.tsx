"use client";

import type { Journal } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";

import { InputField } from "~/components/shared/forms/input-field";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

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
  const addJournalMutation = api.journal.create.useMutation();
  const updateJournalMutation = api.journal.update.useMutation();

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
