"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSchool } from "~/providers/SchoolProvider";
import { useCreateTransaction } from "./CreateTransactionContextProvider";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number<number>().min(1),
  description: z.string().min(1),
  transactionType: z.string().min(1),
  paymentMethod: z.string().min(1),
  journalId: z.string().min(1),
});

export function Step1({
  unpaidRequiredFees,
  defaultJournalId,
  journals,
  onNextAction,
}: {
  unpaidRequiredFees: RouterOutputs["student"]["unpaidRequiredFees"];
  defaultJournalId: string;
  journals: RouterOutputs["accountingJournal"]["all"];
  onNextAction: () => void;
}) {
  const { school } = useSchool();
  const {
    amount,
    description,
    transactionType,
    paymentMethod,
    journalId,
    setAmount,
    setDescription,
    setTransactionType,
    setPaymentMethod,
    setJournalId,
  } = useCreateTransaction();

  const form = useForm({
    defaultValues: {
      amount: amount ?? 0,
      journalId: journalId ?? defaultJournalId,
      description: description ?? "",
      transactionType: transactionType ?? "CREDIT",
      paymentMethod: paymentMethod ?? "",
    },
    resolver: zodResolver(makePaymentFormSchema),
  });

  const t = useTranslations();

  function onSubmit(data: z.infer<typeof makePaymentFormSchema>) {
    if (school.applyRequiredFee === "YES") {
      if (
        unpaidRequiredFees.unpaid !== 0 &&
        !unpaidRequiredFees.journalIds.includes(data.journalId)
      ) {
        toast.error(t("required_fee_warning"));
        return;
      }
    }
    setAmount(data.amount);
    setDescription(data.description);
    setTransactionType(data.transactionType);
    setPaymentMethod(data.paymentMethod);
    setJournalId(data.journalId);
    onNextAction();
  }
  const items: { label: string; value: string }[] = [
    { label: "credit", value: "CREDIT" },
    { label: "debit", value: "DEBIT" },
    { label: "discount", value: "DISCOUNT" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Accounting Journals")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {journals.map((journal) => (
                          <SelectItem key={journal.id} value={journal.id}>
                            {journal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
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
              <Button type="submit">
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
