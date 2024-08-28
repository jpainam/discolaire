import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Printer } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
} from "@repo/ui/form";
import { useStepper } from "@repo/ui/Stepper/use-stepper";

import Step2Details from "./step2details";

const step2Schema = z.object({
  paymentReceived: z.boolean(),
  paymentCorrectness: z.boolean(),
  notifications: z.object({
    emails: z.array(z.string()),
    sms: z.array(z.string()),
  }),
});

export default function Step2() {
  const { nextStep, isDisabledStep, prevStep } = useStepper();
  const params = useParams();
  const form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      paymentReceived: false,
      paymentCorrectness: false,
      notifications: {
        emails: [params.id as string],
        sms: [params.id as string],
      },
    },
  });
  function onSubmit(data: z.infer<typeof step2Schema>) {
    console.log(data);
    nextStep();
  }

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Step2Details />
        <div className="flex flex-row justify-between border">
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
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Détails de versement</FormLabel>
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
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            type="button"
            variant="secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("prev")}
          </Button>
          <Button type="submit" size="sm">
            <Printer className="mr-2 h-4 w-4" /> {t("print")}
          </Button>
          {/* <Button size="sm" type="submit">
            {t("next")}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button> */}
        </div>
      </form>
    </Form>
  );
}
