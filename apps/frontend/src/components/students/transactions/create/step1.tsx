import { makePaymentAtom } from "@/atoms/payment";
import { useLocale } from "@/hooks/use-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { useStepper } from "@repo/ui/Stepper";
import { useAtom } from "jotai";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AmountInput,
  DescriptionInput,
  SelectPaymentMethod,
  SelectTransactionType,
} from "./form-items";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number(),
  description: z.string(),
  transactionType: z.string(),
  paymentMethod: z.string(),
});

type MakePaymentFormValue = z.infer<typeof makePaymentFormSchema>;

export default function Step1() {
  const [makePayment, setMakePayment] = useAtom(makePaymentAtom);

  const form = useForm<MakePaymentFormValue>({
    defaultValues: {
      amount: Number(makePayment.amount),
      description: makePayment.description,
      transactionType: makePayment.transactionType,
      paymentMethod: makePayment.paymentMethod,
    },
    resolver: zodResolver(makePaymentFormSchema),
  });

  const { nextStep, isDisabledStep, prevStep } = useStepper();
  const { t } = useLocale();

  function onSubmit(data: MakePaymentFormValue) {
    setMakePayment((prev) => ({ ...prev, ...data }));
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
          <SelectPaymentMethod className={""} />
          <SelectTransactionType />
          <DescriptionInput />
          <AmountInput />
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("prev")}
          </Button>
          <Button size="sm" type="submit">
            {t("next")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
