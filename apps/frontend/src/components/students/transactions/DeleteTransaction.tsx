import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

const deleteTransactionSchema = z.object({
  observation: z.string().min(1),
});
export function DeleteTransaction({
  transactionId,
}: {
  transactionId: number;
}) {
  const form = useForm({
    schema: deleteTransactionSchema,
    defaultValues: {
      observation: "",
    },
  });
  const { t } = useLocale();
  const utils = api.useUtils();
  const { closeModal } = useModal();
  const deleteTransactionMutation = api.transaction.delete.useMutation({
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      closeModal();
    },
    onSettled: async () => {
      await utils.transaction.invalidate();
      await utils.student.transactions.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof deleteTransactionSchema>) => {
    toast.loading(t("deleting"), { id: 0 });
    deleteTransactionMutation.mutate({
      ids: transactionId,
      observation: data.observation,
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>{t("observation")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-end justify-end gap-2">
          <Button
            size={"sm"}
            onClick={() => {
              closeModal();
            }}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={deleteTransactionMutation.isPending}
            variant={"destructive"}
            size={"sm"}
            type="submit"
          >
            {t("continue")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
