"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";

const makePaymentFormSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().min(1),
  transactionType: z.string().min(1),
  paymentMethod: z.string().min(1),
  journalId: z.string().min(1),
});

export function Step1({
  unpaidRequiredFees,
  studentId,
}: {
  unpaidRequiredFees: RouterOutputs["student"]["unpaidRequiredFees"];
  studentId: string;
}) {
  const { school } = useSchool();

  const form = useForm({
    defaultValues: {
      amount: 0,
      journalId: "",
      description: "",
      transactionType: "CREDIT",
      paymentMethod: "",
    },
    resolver: zodResolver(makePaymentFormSchema),
  });
  const { t } = useLocale();

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  const trpc = useTRPC();
  const journalQuery = useQuery(trpc.accountingJournal.all.queryOptions());

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
    router.push(
      "?" +
        createQueryString({
          amount: data.amount,
          description: data.description,
          transactionType: data.transactionType,
          paymentMethod: data.paymentMethod,
          journalId: data.journalId,
          studentId: studentId,
          step: "step2",
        }),
    );
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
                        {journalQuery.isPending ? (
                          <SelectItem value="_all" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          </SelectItem>
                        ) : (
                          journalQuery.data?.map((journal) => (
                            <SelectItem key={journal.id} value={journal.id}>
                              {journal.name}
                            </SelectItem>
                          ))
                        )}
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
