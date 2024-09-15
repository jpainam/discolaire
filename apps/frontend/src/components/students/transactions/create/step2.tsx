"use client";

import { useAtomValue } from "jotai";
import { sumBy } from "lodash";
import { ArrowLeft, Save } from "lucide-react";
import { z } from "zod";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
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
import { Skeleton } from "@repo/ui/skeleton";

import { makePaymentAtom } from "~/atoms/payment";
import { api } from "~/trpc/react";
import Step2Details from "./step2details";

const step2Schema = z.object({
  paymentReceived: z.boolean(),
  paymentCorrectness: z.boolean(),
  notifications: z.array(z.string()),
});

export function Step2({
  classroomName,
  classroomId,
}: {
  classroomName: string;
  classroomId: string;
}) {
  const router = useRouter();

  const form = useForm({
    schema: step2Schema,
    defaultValues: {
      paymentReceived: false,
      paymentCorrectness: false,
      notifications: [],
    },
  });
  function onSubmit(data: z.infer<typeof step2Schema>) {
    console.log(data);
  }

  const { t } = useLocale();
  const payment = useAtomValue(makePaymentAtom);
  if (
    !payment.amount ||
    !payment.description ||
    !payment.transactionType ||
    !payment.paymentMethod
  ) {
    router.push("./create?step=1");
  }

  const feesQuery = api.classroom.fees.useQuery(classroomId);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-2"
      >
        {feesQuery.isPending && <Skeleton className="h-1/4 w-full" />}
        {feesQuery.data && (
          <Step2Details
            classroomName={classroomName}
            totalFee={sumBy(feesQuery.data, "amount")}
          />
        )}

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
              router.push("./create?step=1");
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("prev")}
          </Button>
          <Button type="submit" size="sm">
            <Save className="mr-2 h-4 w-4" /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
