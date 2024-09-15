"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { parseAsFloat, useQueryState } from "nuqs";
import { z } from "zod";

import { useRouter } from "@repo/hooks/use-router";
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
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().min(1),
  transactionType: z.string().min(1),
  paymentMethod: z.string().min(1),
});

export function Step1() {
  const [amount] = useQueryState("amount", parseAsFloat.withDefault(0));
  const [description] = useQueryState("description", {
    defaultValue: "",
  });
  const [transactionType] = useQueryState("transactionType", {
    defaultValue: "",
  });
  const [paymentMethod] = useQueryState("paymentMethod", {
    defaultValue: "",
  });
  const form = useForm({
    defaultValues: {
      amount: amount,
      description: description,
      transactionType: transactionType,
      paymentMethod: paymentMethod,
    },
    schema: makePaymentFormSchema,
  });
  const router = useRouter();
  const { t } = useLocale();

  function onSubmit(data: z.infer<typeof makePaymentFormSchema>) {
    const values = {
      amount: `${data.amount}`,
      description: data.description,
      transactionType: data.transactionType,
      paymentMethod: data.paymentMethod,
    };
    const searchParams = new URLSearchParams(values).toString();

    router.push(`./create?${searchParams}`);
  }
  const items: { label: string; value: string }[] = [
    { label: "credit", value: "CREDIT" },
    { label: "debit", value: "DEBIT" },
    { label: "discount", value: "REFUND" },
  ];
  const searchParams = useSearchParams();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>{JSON.stringify(searchParams)}</div>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-2 px-4 md:grid-cols-2 md:gap-4">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("payment_method")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">{t("cash")}</SelectItem>
                    <SelectItem value="card">{t("card")}</SelectItem>
                    <SelectItem value="check">{t("check")}</SelectItem>
                    <SelectItem value="emoney">{t("emoney")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transactionType"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("transaction_type")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("select_an_option")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {t(item.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("Description")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Description")} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>{t("amount")}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t("amount")} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full flex justify-end gap-2">
            <Button size="sm" type="submit">
              {t("next")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
