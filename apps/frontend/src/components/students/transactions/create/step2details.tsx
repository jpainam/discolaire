import { useState } from "react";
import { useParams } from "next/navigation";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";
import { sumBy } from "lodash";
import { AtSign, Copy, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Checkbox } from "@repo/ui/checkbox";
import { FormControl, FormField, FormItem } from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";

import { makePaymentAtom } from "~/atoms/payment";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { getFullName } from "~/utils/full-name";

type Fee = RouterOutputs["classroom"]["fees"][number];

export default function Step2Details() {
  const payment = useAtomValue(makePaymentAtom);
  const params = useParams<{ id: string }>();
  const form = useFormContext();
  const studentQuery = api.student.get.useQuery(params.id);
  const [transactionDate, _setTransactionDate] = useState<Date>(new Date());
  const [remaining, _setRemaining] = useState(0);
  const [paySoFar, _setPaySoFar] = useState(0);

  const studentContactsQuery = api.student.contacts.useQuery(params.id);

  //const feesQuery = api.classroom.fees.useQuery({ id: student?.classroom?.id });
  const fees: Fee[] = [];

  const { t, i18n } = useLocale();
  const { fullDateTimeFormatter } = useDateFormat();

  // const {
  //   data: transactions,
  //   isPending: transactionIsPending,
  //   error: transactionsError,
  //   isError: transactionsIsError,
  // } = useStudentTransactionsQuery(params.id);

  // useEffect(() => {
  //   const s = sumBy(transactions, "amount");
  //   setPaySoFar(s);
  //   const totalFees = sumBy(fees, "amount");
  //   setRemaining(totalFees - s);
  // }, [transactions, fees]);

  // if (feesIsPending || transactionIsPending || isPending) {
  //   return <DataTableSkeleton rowCount={6} columnCount={2} />;
  // }
  // if (isError || feesIsError || transactionsIsError) {
  //   isError && showErrorToast(error);
  //   feesIsError && showErrorToast(feesError);
  //   transactionsIsError && showErrorToast(transactionsError);
  //   throw error ?? feesError ?? transactionsError;
  // }
  return (
    <Card className="rounded-none">
      <CardHeader className="flex flex-row items-center bg-muted/50 py-1">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            REF. -
            <Button
              size="icon"
              type="button"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">copy ref ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {fullDateTimeFormatter.format(transactionDate)}
          </CardDescription>
        </div>
        <div className="ml-auto flex flex-row items-center gap-2 rounded-md border bg-black px-2 py-1 text-white">
          <span className="text-lg font-bold">{t("amount")}:</span>
          <span className="text-lg font-bold text-green-600">
            {payment.amount.toLocaleString(i18n.language)} {CURRENCY}
          </span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-6 py-2 text-sm">
        <div className="grid gap-2">
          <div className="font-semibold">{t("transactionDetails")}</div>
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("receivedFrom")}</span>
              <span>{getFullName(studentQuery.data)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("for")}</span>
              <span>{payment.description}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-2" />
        <ul className="grid gap-2">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("amountPaidSoFar")}
            </span>
            <span className="text-md flex flex-row font-bold text-green-600">
              + {paySoFar.toLocaleString(i18n.language)} {CURRENCY}
              <TrendingUpIcon className="ms-1 h-4 w-4" />
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("class_fees")}</span>
            <span className="text-md flex flex-row font-bold text-red-600">
              -{sumBy(fees, "amount").toLocaleString(i18n.language)} {CURRENCY}{" "}
              <TrendingDownIcon className="ms-1 h-4 w-4" />
            </span>
          </li>
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">{t("remaining")}</span>
            <span className="flex flex-row items-center gap-2">
              {remaining.toLocaleString(i18n.language)} {CURRENCY}{" "}
              {remaining == 0 ? <span>🎉</span> : <></>}
            </span>
          </li>
        </ul>

        <Separator className="my-2" />
        <div className="grid gap-2">
          <div className="font-semibold">{t("sendNotifications")}</div>
          <FormField
            control={form.control}
            name="notifications"
            render={() => (
              <FormItem className="grid gap-2 text-muted-foreground md:grid-cols-4">
                <NotificationFragment
                  key={`${studentQuery.data?.id}-notification-0`}
                  name={studentQuery.data?.lastName ?? ""}
                  itemId={studentQuery.data?.id ?? ""}
                />
                {studentContactsQuery.data?.map((item, index) => (
                  <NotificationFragment
                    key={`${item.contactId}-notification-${index}`}
                    name={item.contact.lastName ?? ""}
                    itemId={item.contactId}
                  />
                ))}
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationFragment({
  itemId,
  name,
}: {
  itemId: string;
  name: string;
}) {
  const form = useFormContext();
  return (
    <FormField
      key={itemId}
      control={form.control}
      name="notifications"
      render={({ field }) => {
        return (
          <FormItem
            key={`${itemId}-notification-fragment`}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <FormControl>
              <div className="flex flex-col gap-1">
                <div>{name}</div>
                <div className="flex flex-row items-center gap-1">
                  <Checkbox
                    checked={field.value?.emails?.includes(itemId)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange({
                            ...field.value,
                            emails: [...field.value.emails, itemId],
                          })
                        : field.onChange({
                            ...field.value,
                            emails: field.value?.emails?.filter(
                              (value: string) => value !== itemId,
                            ),
                          });
                    }}
                  />
                  <AtSign className="h-4 w-4" /> Emails
                </div>

                <div className="flex flex-row items-center gap-1">
                  <Checkbox
                    checked={field.value?.sms?.includes(itemId)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange({
                            ...field.value,
                            sms: [...field.value.sms, itemId],
                          })
                        : field.onChange({
                            ...field.value,
                            sms: field.value?.sms?.filter(
                              (value: string) => value !== itemId,
                            ),
                          });
                    }}
                  />
                  <EnvelopeOpenIcon className="h-4 w-4" /> SMS
                </div>
              </div>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
