import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";

import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";

const deleteTransactionSchema = z.object({
  observation: z.string().min(1),
});
export function DeleteTransaction({
  transactionId,
}: {
  transactionId: number | number[];
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
  const transactionQuery = api.transaction.get.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Array.isArray(transactionId) ? transactionId[0]! : transactionId,
  );
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
  const transaction = transactionQuery.data;
  return (
    <Form {...form}>
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        {transactionQuery.isPending ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2">
            <Label>{t("account")}</Label>
            <span className="text-sm text-muted-foreground">
              {transaction?.account.student.lastName}
            </span>
            <Label>{t("amount")}</Label>
            <span className="text-sm text-muted-foreground">
              {transaction?.amount} {CURRENCY}
            </span>
          </div>
        )}
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
