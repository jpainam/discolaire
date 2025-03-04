"use client";

import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@repo/ui/components/form";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import Step2Details from "./step2details";

const step2Schema = z.object({
  paymentReceived: z.boolean(),
  paymentCorrectness: z.boolean(),
  notifications: z.array(z.string()).default([]),
});

export function Step2({
  classroomId,
  amount,
  description,
  transactionType,
  paymentMethod,
  contacts,
}: {
  classroomId: string;
  amount: number;
  paymentMethod: string;
  description: string;
  transactionType: string;
  contacts: RouterOutputs["student"]["contacts"][number][];
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const studentId = params.id;

  const utils = api.useUtils();
  const createTransactionMutation = api.transaction.create.useMutation({
    onSettled: async () => {
      await utils.student.transactions.invalidate(studentId);
    },
    onSuccess: (transaction) => {
      toast.success(t("created_successfully"), { id: 0 });
      router.push(
        routes.students.transactions.details(params.id, transaction.id)
      );
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const form = useForm({
    schema: step2Schema,
    defaultValues: {
      paymentReceived: false,
      paymentCorrectness: false,
      notifications: [params.id, ...contacts.map((c) => c.contactId)],
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
    toast.loading(t("creating"), { id: 0 });
    createTransactionMutation.mutate({
      method: paymentMethod,
      description: description,
      studentId: studentId,
      transactionType: transactionType,
      amount: Number(amount),
    });
  }

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-8 w-full max-w-3xl space-y-2"
      >
        <Step2Details classroomId={classroomId} />
        <div className="flex flex-row justify-between rounded-xl border">
          <FormField
            control={form.control}
            name="paymentReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
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
              router.push("./create");
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            <ArrowLeft />
            {t("prev")}
          </Button>
          <Button
            isLoading={createTransactionMutation.isPending}
            disabled={createTransactionMutation.isPending}
            type="submit"
            size="sm"
          >
            <Save /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
