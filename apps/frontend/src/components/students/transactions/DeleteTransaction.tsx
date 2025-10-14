import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const deleteTransactionSchema = z.object({
  observation: z.string().min(1),
});
export function DeleteTransaction({
  transactionIds,
}: {
  transactionIds: number[];
}) {
  const form = useForm({
    resolver: zodResolver(deleteTransactionSchema),
    defaultValues: {
      observation: "",
    },
  });
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();

  const deleteTransactionMutation = useMutation(
    trpc.transaction.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.transaction.pathFilter());
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof deleteTransactionSchema>) => {
    toast.loading(t("deleting"), { id: 0 });
    deleteTransactionMutation.mutate({
      ids: transactionIds,
      observation: data.observation,
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("Explain why you are deleting these transactions")}
              </FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-end justify-end gap-4">
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
