import { sumBy } from "lodash";
import { Copy, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { parseAsFloat, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormContext,
} from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";

import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { getFullName } from "~/utils/full-name";

export default function Step2Details({ classroomId }: { classroomId: string }) {
  const params = useParams<{ id: string }>();
  const form = useFormContext();
  const studentQuery = api.student.get.useQuery(params.id);
  const [transactionDate, _setTransactionDate] = useState<Date>(new Date());
  const [paySoFar, setPaySoFar] = useState(0);
  const [totalFee, setTotalFee] = useState(0);

  const studentContactsQuery = api.student.contacts.useQuery(params.id);
  const feesQuery = api.classroom.fees.useQuery(classroomId);
  const classsroomQuery = api.classroom.get.useQuery(classroomId);
  const [amount] = useQueryState("amount", parseAsFloat);
  const [description] = useQueryState("description");

  const { t, i18n } = useLocale();
  const { fullDateTimeFormatter } = useDateFormat();
  const transactions = api.student.transactions.useQuery(params.id);
  useEffect(() => {
    if (!transactions.data || !feesQuery.data) return;
    const total = sumBy(feesQuery.data, "amount");
    const paid = sumBy(transactions.data, "amount");
    setPaySoFar(paid);
    setTotalFee(total);
  }, [transactions.data, feesQuery.data]);

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
  if (
    studentQuery.isPending ||
    studentContactsQuery.isPending ||
    transactions.isPending ||
    feesQuery.isPending ||
    classsroomQuery.isPending
  ) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 16 }).map((_, index) => {
          return <Skeleton key={`step2-${index}`} className="h-8 w-full" />;
        })}
      </div>
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
          <span className="font-semibold">{classsroomQuery.data?.name}</span>
          <FlatBadge variant={"green"} className="flex gap-4 font-bold">
            <span>{t("amount")}:</span>
            <span className="font-bold">
              {amount?.toLocaleString(i18n.language)} {CURRENCY}
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
              <span>{description}</span>
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
              {(totalFee - paySoFar).toLocaleString(i18n.language)} {CURRENCY}{" "}
              {totalFee - paySoFar == 0 ? <span>🎉</span> : <></>}
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
              <FormItem className="flex flex-col gap-2 space-y-0">
                {studentContactsQuery.data?.map((item) => (
                  <FormField
                    key={`form-field-contact-${item.studentId}-${item.contactId}`}
                    control={form.control}
                    name="notifications"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={`form-item-contact-${item.studentId}-${item.contactId}`}
                          className="flex flex-row items-center space-x-2 space-y-0"
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
