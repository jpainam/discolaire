import { useState } from "react";
import { sumBy } from "lodash";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { getFullName } from "~/utils";
import { useCreateTransaction } from "./CreateTransactionContextProvider";

export default function Step2Details() {
  const {
    fees,
    transactions,
    amount,
    description,
    student,
    classroom,
    studentContacts,
    notifications,
    setNotifications,
  } = useCreateTransaction();

  const total = sumBy(fees, "amount");
  const paid = transactions
    .filter((t) => t.status == "VALIDATED")
    .reduce(
      (acc, curr) =>
        acc + (curr.transactionType == "DEBIT" ? -curr.amount : curr.amount),
      0,
    );

  const [transactionDate, _setTransactionDate] = useState<Date>(new Date());

  const { t, i18n } = useLocale();
  const fullDateTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {classroom.name}
          {/* <Button
            size="icon"
            type="button"
            variant="outline"
            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Copy className="h-3 w-3" />
            <span className="sr-only">copy ref ID</span>
          </Button> */}
        </CardTitle>
        <CardDescription>
          {fullDateTimeFormatter.format(transactionDate)}
        </CardDescription>
        <CardAction>
          <FlatBadge variant={"green"} className="flex gap-4 font-bold">
            <span>{t("amount")}:</span>
            <span className="font-bold">
              {amount?.toLocaleString(i18n.language)} {CURRENCY}
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
              <span className="text-muted-foreground">{t("receivedFrom")}</span>
              <span>{getFullName(student)}</span>
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
              + {paid.toLocaleString(i18n.language)} {CURRENCY}
              <TrendingUpIcon className="ms-1 h-4 w-4" />
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("class_fees")}</span>
            <span className="text-md flex flex-row font-bold text-red-600">
              -{total.toLocaleString(i18n.language)} {CURRENCY}{" "}
              <TrendingDownIcon className="ms-1 h-4 w-4" />
            </span>
          </li>
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">{t("remaining")}</span>
            <span className="flex flex-row items-center gap-2">
              {(total - paid).toLocaleString(i18n.language)} {CURRENCY}{" "}
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
  );
}
