import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { sumBy } from "lodash";
import { Copy, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { toast } from "sonner";

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
import FlatBadge from "@repo/ui/FlatBadge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";

import { makePaymentAtom } from "~/atoms/payment";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { getFullName } from "~/utils/full-name";

export default function Step2Details({
  classroomName,
  totalFee,
}: {
  classroomName: string;
  totalFee: number;
}) {
  const payment = useAtomValue(makePaymentAtom);
  const params = useParams<{ id: string }>();
  const form = useFormContext();
  const studentQuery = api.student.get.useQuery(params.id);
  const [transactionDate, _setTransactionDate] = useState<Date>(new Date());
  const [remaining, setRemaining] = useState(0);
  const [paySoFar, setPaySoFar] = useState(0);

  const studentContactsQuery = api.student.contacts.useQuery(params.id);

  const { t, i18n } = useLocale();
  const { fullDateTimeFormatter } = useDateFormat();
  const transactions = api.student.transactions.useQuery(params.id);
  useEffect(() => {
    const s = sumBy(transactions.data, "amount");
    setPaySoFar(s);
    setRemaining(totalFee - s);
  }, [transactions, totalFee]);

  if (
    studentQuery.isError ||
    studentContactsQuery.isError ||
    transactions.isError
  ) {
    toast.error(
      studentQuery.error?.message ??
        studentContactsQuery.error?.message ??
        transactions.error?.message,
    );
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 px-4 py-0">
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
        <div className="flex flex-col gap-1 pb-2">
          <span className="font-semibold">{classroomName}</span>
          <FlatBadge variant={"green"} className="flex gap-4 font-bold">
            <span>{t("amount")}:</span>
            <span className="font-bold">
              {payment.amount.toLocaleString(i18n.language)} {CURRENCY}
            </span>
          </FlatBadge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="px-4 py-2 text-sm">
        <div className="grid gap-2">
          <div className="font-semibold">{t("transactionDetails")}</div>
          <ul className="grid gap-1">
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
        <ul className="grid gap-1">
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
              -{totalFee.toLocaleString(i18n.language)} {CURRENCY}{" "}
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
          <div className="font-semibold">{t("notify")}</div>
          <FormField
            control={form.control}
            name="notifications"
            render={() => (
              <FormItem className="space-y-0">
                {studentContactsQuery.data?.map((item) => (
                  <FormField
                    key={`form-field-contact-${item.studentId}-${item.contactId}`}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={`form-item-contact-${item.studentId}-${item.contactId}`}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.contactId)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      item.contactId,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) =>
                                          value !== item.contactId,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {JSON.stringify(field.value)} -{" "}
                            {JSON.stringify(typeof field.value)} -{" "}
                            {item.contact.lastName} {item.contact.firstName}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
