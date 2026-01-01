"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { TransactionType } from "@repo/db/enums";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Spinner } from "~/components/ui/spinner";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { useCreateTransaction } from "./CreateTransactionContextProvider";
import { Step2Details } from "./step2details";

const step2Schema = z.object({
  paymentReceived: z.boolean().default(false),
  paymentCorrectness: z.boolean().default(false),
});

export function Step2({ onPrevAction }: { onPrevAction: () => void }) {
  const {
    amount,
    description,
    transactionType,
    paymentMethod,
    journalId,
    student,
  } = useCreateTransaction();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createTransactionMutation = useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: async (transaction) => {
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        router.push(
          routes.students.transactions.details(student.id, transaction.id),
        );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      paymentReceived: false,
      paymentCorrectness: false,
    },
  });

  function onSubmit(data: z.infer<typeof step2Schema>) {
    if (!data.paymentReceived) {
      toast.warning(t("please_check_the_amount_received_box"));
      return;
    }
    if (!data.paymentCorrectness) {
      toast.warning(t("please_check_the_payment_details_box"));
      return;
    }

    if (
      amount == null ||
      !description ||
      !transactionType ||
      !paymentMethod ||
      !journalId
    ) {
      toast.error(t("missing_required_fields"));
      return;
    }
    toast.loading(t("creating"), { id: 0 });

    createTransactionMutation.mutate({
      method: paymentMethod,
      description,
      studentId: student.id,
      transactionType: transactionType as TransactionType,
      amount,
      journalId,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-8 w-full max-w-3xl space-y-2"
      >
        <Step2Details />
        <div className="flex flex-row justify-between rounded-xl border">
          <FormField
            control={form.control}
            name="paymentReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("amount_received")} ?</FormLabel>
                  <FormDescription className="text-xs">
                    {t("amount_received_confirmation")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentCorrectness"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    id={"paymentCorrectness"}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="paymentCorrectness">
                    {t("payment_details")}
                  </FormLabel>
                  <FormDescription className="text-xs">
                    {t("amount_details_confirmation")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            onClick={() => {
              onPrevAction();
            }}
            type="button"
            variant="outline"
          >
            <ArrowLeft />
            {t("prev")}
          </Button>
          <Button disabled={createTransactionMutation.isPending} type="submit">
            {createTransactionMutation.isPending && <Spinner />} {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
