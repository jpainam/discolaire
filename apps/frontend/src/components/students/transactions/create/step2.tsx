"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import type { TransactionType } from "@repo/db/enums";

import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { createTransactionSchemaStep1 } from "~/utils/search-params";

const step2Schema = z.object({
  paymentReceived: z.boolean().default(false),
  paymentCorrectness: z.boolean().default(false),
  notifications: z.array(z.string()).default([]),
});

export function Step2({
  studentContacts,
  fees,
  classroom,
  transactions,
  student,
}: {
  studentContacts: RouterOutputs["student"]["contacts"];
  fees: RouterOutputs["classroom"]["fees"];
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  transactions: RouterOutputs["student"]["transactions"];
  student: RouterOutputs["student"]["get"];
}) {
  const [searchParams, _] = useQueryStates(createTransactionSchemaStep1);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<string[]>([]);

  const createTransactionMutation = useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: async (transaction) => {
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        if (searchParams.studentId)
          router.push(
            routes.students.transactions.details(
              searchParams.studentId,
              transaction.id,
            ),
          );
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      paymentReceived: false,
      paymentCorrectness: false,
      notifications: [
        searchParams.studentId ?? "",
        ...studentContacts.map((c) => c.contactId),
      ],
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

    if (
      !searchParams.amount ||
      !searchParams.description ||
      !searchParams.transactionType ||
      !searchParams.paymentMethod ||
      !searchParams.journalId ||
      !searchParams.studentId
    ) {
      toast.error(t("missing_required_fields"));
      return;
    }
    toast.loading(t("creating"), { id: 0 });

    createTransactionMutation.mutate({
      method: searchParams.paymentMethod,
      description: searchParams.description,
      studentId: searchParams.studentId,
      transactionType: searchParams.transactionType as TransactionType,
      amount: Number(searchParams.amount),
      journalId: searchParams.journalId,
    });
  }

  const locale = useLocale();

  const filterredFees = fees.filter(
    (f) => f.journalId === searchParams.journalId,
  );
  const total = filterredFees.reduce((acc, curr) => acc + curr.amount, 0);

  const paid = transactions
    .filter(
      (t) => t.status == "VALIDATED" && t.journalId == searchParams.journalId,
    )
    .reduce(
      (acc, curr) =>
        acc + (curr.transactionType == "DEBIT" ? -curr.amount : curr.amount),
      0,
    );

  const t = useTranslations();
  const fullDateTimeFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-8 w-full max-w-3xl space-y-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{classroom.name}</CardTitle>
            <CardDescription>
              {fullDateTimeFormatter.format(new Date())}
            </CardDescription>
            <CardAction>
              <FlatBadge variant={"green"} className="flex gap-4 font-bold">
                <span>{t("amount")}:</span>
                <span className="font-bold">
                  {searchParams.amount?.toLocaleString(locale)} {CURRENCY}
                </span>
              </FlatBadge>
            </CardAction>
          </CardHeader>
          <Separator />
          <CardContent className="text-sm">
            <div className="grid gap-2">
              <div className="font-semibold">{t("transactionDetails")}</div>
              <ul className="grid gap-1">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t("receivedFrom")}
                  </span>
                  <span>{getFullName(student)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("for")}</span>
                  <span>{searchParams.description}</span>
                </li>
              </ul>
            </div>
            <Separator className="my-2" />
            <ul className="grid gap-1">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t("amountPaidSoFar")}
                </span>
                <span className="text-md flex flex-row font-bold text-green-600">
                  + {paid.toLocaleString(locale)} {CURRENCY}
                  <TrendingUpIcon className="ms-1 h-4 w-4" />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("class_fees")}</span>
                <span className="text-md flex flex-row font-bold text-red-600">
                  -{total.toLocaleString(locale)} {CURRENCY}{" "}
                  <TrendingDownIcon className="ms-1 h-4 w-4" />
                </span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">{t("remaining")}</span>
                <span className="flex flex-row items-center gap-2">
                  {(total - paid).toLocaleString(locale)} {CURRENCY}{" "}
                  {total - paid == 0 ? <span>🎉</span> : <></>}
                </span>
              </li>
            </ul>

            <Separator className="my-2" />
            <div className="grid gap-2">
              <div className="font-semibold">{t("notify")}</div>

              <div className="flex flex-col gap-2 space-y-0">
                {studentContacts.map((item) => (
                  <div
                    key={`form-item-contact-${item.studentId}-${item.contactId}`}
                    className="flex flex-row items-center space-y-0 space-x-2"
                  >
                    <Checkbox
                      id={`contact-${item.contactId}`}
                      checked={notifications.includes(item.contactId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNotifications([...notifications, item.contactId]);
                        } else {
                          setNotifications(
                            notifications.filter((i) => i !== item.contactId),
                          );
                        }
                      }}
                    />

                    <Label
                      htmlFor={`contact-${item.contactId}`}
                      className="text-sm font-normal"
                    >
                      {item.contact.lastName} {item.contact.firstName}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-row justify-between rounded-xl border">
          <FormField
            control={form.control}
            name="paymentReceived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-4">
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
              <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-4">
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
            type="button"
            variant="outline"
          >
            <ArrowLeft />
            {t("prev")}
          </Button>
          <Button disabled={createTransactionMutation.isPending} type="submit">
            {createTransactionMutation.isPending && <Spinner />} {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
