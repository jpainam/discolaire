"use client";

import { useAtomValue } from "jotai";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { parseAsFloat, useQueryState } from "nuqs";
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

import { useRouter } from "~/hooks/use-router";
import { useSchool } from "~/providers/SchoolProvider";
import { api } from "~/trpc/react";
import { requiredFeesAtom } from "./required-fees-atom";
import { RequiredFeeForm } from "./RequiredFeeForm";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().min(1),
  transactionType: z.string().min(1),
  paymentMethod: z.string().min(1),
});

export function Step1() {
  const [amount] = useQueryState("amount", parseAsFloat.withDefault(0));
  const { school } = useSchool();

  const requiredFeeIds = useAtomValue(requiredFeesAtom);

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
  const params = useParams<{ id: string }>();

  const checkRequiredFeeMutation = api.fee.checkRequiredFees.useMutation();

  function onSubmit(data: z.infer<typeof makePaymentFormSchema>) {
    const values = {
      amount: `${data.amount}`,
      description: data.description,
      transactionType: data.transactionType,
      paymentMethod: data.paymentMethod,
    };
    const searchParams = new URLSearchParams(values).toString();
    checkRequiredFeeMutation.mutate(
      { studentId: params.id, feeIds: requiredFeeIds },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: (result) => {
          if (result) {
            router.push(`./create?${searchParams}`);
          } else {
            toast.error(t("required_fee_warning"));
          }
        },
      },
    );
  }
  const items: { label: string; value: string }[] = [
    { label: "credit", value: "CREDIT" },
    { label: "debit", value: "DEBIT" },
    { label: "discount", value: "DISCOUNT" },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {school.applyRequiredFee !== "NO" && <RequiredFeeForm />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2 px-4 md:grid-cols-2 md:gap-4">
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
                <FormItem className="space-y-0">
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
              <Button
                isLoading={checkRequiredFeeMutation.isPending}
                size="sm"
                type="submit"
              >
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
