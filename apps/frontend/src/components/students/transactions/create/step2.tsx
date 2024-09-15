"use client";

import { useParams } from "next/navigation";
import { render } from "@react-email/components";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { TransactionAcknowledgment } from "@repo/transactional/emails/TransactionAcknowledgment";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@repo/ui/form";

import { routes } from "~/configs/routes";
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
}: {
  classroomId: string;
  amount: number;
  paymentMethod: string;
  description: string;
  transactionType: string;
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sendNotification = api.messaging.sendEmail.useMutation({
    onSuccess: () => {
      toast.success(t("email_sent_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createTransactionMutation = api.transaction.create.useMutation({
    onSuccess: async (result) => {
      toast.success(t("created_successfully"), { id: 0 });
      const emailHtml = await render(
        <TransactionAcknowledgment transactionId={result.id} />,
      );
      void sendNotification.mutate({
        subject: "Transaction Acknowledgment",
        to: ["jpainam@gmail.com"],
        body: emailHtml,
      });
      router.push(routes.students.transactions.details(params.id, result.id));
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
      notifications: [params.id],
    },
  });
  function onSubmit(data: z.infer<typeof step2Schema>) {
    if (!data.paymentReceived) {
      toast.warning("Veuillez cocher la case 'Montant perçu'");
      return;
    }
    if (!data.paymentCorrectness) {
      toast.warning("Veuillez cocher la case 'Détails de versement'");
      return;
    }
    toast.loading(t("creating"), { id: 0 });
    createTransactionMutation.mutate({
      method: paymentMethod,
      description: description,
      studentId: params.id,
      transactionType: transactionType,
      amount: Number(amount),
    });
  }

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-2"
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
                  <FormLabel>Montant perçu ?</FormLabel>
                  <FormDescription>
                    En cochant cette case, vous certifiez avoir recu ce montant
                    en votre nom
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
                    Détails de versement
                  </FormLabel>
                  <FormDescription>
                    En cochant cette case, vous certifiez que les détails (Reçu
                    de, Pour, Montant et Reste) sont corrects.
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("prev")}
          </Button>
          <Button
            isLoading={createTransactionMutation.isPending}
            type="submit"
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
