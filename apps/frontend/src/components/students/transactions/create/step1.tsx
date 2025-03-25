"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useLocale } from "~/i18n";

import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import i18next from "i18next";
import { CURRENCY } from "~/lib/constants";
import { useSchool } from "~/providers/SchoolProvider";
import { useCreateTransaction } from "./CreateTransactionContextProvider";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().min(1),
  transactionType: z.string().min(1),
  paymentMethod: z.string().min(1),
});

export function Step1() {
  const {
    amount,
    setAmount,
    description,
    setDescription,
    transactionType,
    setTransactionType,
    paymentMethod,
    setPaymentMethod,
    unpaidRequiredFees,
    requiredFeeIds,
    setRequiredFeeIds,
  } = useCreateTransaction();

  const { school } = useSchool();

  const form = useForm({
    defaultValues: {
      amount: amount ?? 0,
      description: description ?? "",
      transactionType: transactionType ?? "",
      paymentMethod: paymentMethod ?? "",
    },
    schema: makePaymentFormSchema,
  });
  const { t } = useLocale();

  function onSubmit(data: z.infer<typeof makePaymentFormSchema>) {
    if (school.applyRequiredFee === "YES") {
      const missingFees = unpaidRequiredFees.filter(
        (fee) => !requiredFeeIds.includes(fee.id),
      );
      if (missingFees.length !== 0) {
        toast.error(t("required_fee_warning"));
        return;
      }
    }
    setTransactionType(data.transactionType);
    setPaymentMethod(data.paymentMethod);
    setAmount(data.amount);
    setDescription(data.description);
  }
  const items: { label: string; value: string }[] = [
    { label: "credit", value: "CREDIT" },
    { label: "debit", value: "DEBIT" },
    { label: "discount", value: "DISCOUNT" },
  ];

  return (
    <div className="mx-auto w-full flex flex-col gap-8 max-w-3xl">
      {school.applyRequiredFee !== "NO" && (
        <div className="flex flex-col gap-2">
          <Label>{t("required_fees")}</Label>
          {unpaidRequiredFees.map((fee, index) => {
            return (
              <div
                key={`unpaid-${fee.id}`}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`requiredfee-${index}`}
                  checked={requiredFeeIds.includes(fee.id)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setRequiredFeeIds([...requiredFeeIds, fee.id]);
                    } else {
                      setRequiredFeeIds(
                        requiredFeeIds.filter((i) => i !== fee.id),
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`requiredfee-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {fee.description} (
                  {fee.amount.toLocaleString(i18next.language, {
                    style: "currency",
                    currency: CURRENCY,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                  )
                </Label>
              </div>
            );
          })}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6  md:grid-cols-2 md:gap-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("payment_method")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("select_an_option")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">{t("cash")}</SelectItem>
                      <SelectItem value="CARD">{t("card")}</SelectItem>
                      <SelectItem value="CHECK">{t("check")}</SelectItem>
                      <SelectItem value="EMONEY">{t("emoney")}</SelectItem>
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
                <FormItem>
                  <FormLabel>{t("transaction_type")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
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
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("description")} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
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
                <ArrowRight />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
