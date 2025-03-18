"use client";

import {
  AlignStartHorizontal,
  Badge,
  CalendarDays,
  Clock,
  DollarSign,
  File,
  FileSliders,
  Library,
  Loader,
  Printer,
  Trash2,
  User,
  X,
} from "lucide-react";
import { notFound } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { Label } from "@repo/ui/components/label";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { getFullName } from "~/utils/full-name";
import { useMoneyFormat } from "~/utils/money-format";

export function TransactionDetails({
  transactionId,
}: {
  transactionId: number;
}) {
  const { t } = useLocale();
  const { moneyFormatter } = useMoneyFormat();
  const { fullDateFormatter } = useDateFormat();
  const { closeModal } = useModal();

  const transactionQuery = api.transaction.get.useQuery(transactionId);

  if (transactionQuery.isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!transactionQuery.data) {
    notFound();
  }
  if (transactionQuery.isError) {
    toast.error(transactionQuery.error.message);
    return;
  }
  const transaction = transactionQuery.data;
  return (
    <div className="grid gap-3 text-sm md:grid-cols-2">
      <div className="flex flex-row items-center gap-1">
        <Badge className="w-4 h-4" />
        {/* <Label>{t("account")}:</Label> */}
        {transactionQuery.data.account.name}
      </div>
      <div className="flex flex-row items-center gap-1">
        <User className="w-4 h-4" />
        {/* <Label>{t("student")}:</Label> */}
        <span className="overflow-hidden truncate">
          {getFullName(transactionQuery.data.account.student)}
        </span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <DollarSign className="w-4 h-4" />
        {/* <Label>{t("amount")}:</Label> */}
        {moneyFormatter.format(transactionQuery.data.amount)}
      </div>
      <div className="flex flex-row items-center gap-1">
        <File className="w-4 h-4" />
        {/* <Label>{t("description")}:</Label> */}
        <span className="overflow-hidden truncate">
          {transactionQuery.data.description}
        </span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Clock className="w-4 h-4" />
        {/* <Label>{t("status")}:</Label> */}
        <FlatBadge
          variant={
            transactionQuery.data.status == "VALIDATED"
              ? "green"
              : transactionQuery.data.status == "CANCELED"
                ? "red"
                : "yellow"
          }
        >
          {t(transactionQuery.data.status.toLowerCase())}
        </FlatBadge>
      </div>
      <div className="flex flex-row items-center gap-1">
        <FileSliders className="w-4 h-4" />
        {/* <Label>{t("transactionRef")}:</Label> */}
        {transaction.transactionRef}
      </div>
      <div className="flex flex-row items-center gap-1">
        <AlignStartHorizontal className="w-4 h-4" />
        {/* <Label>{t("transactionType")}:</Label> */}
        {transaction.transactionType}
      </div>
      <div className="flex flex-row items-center gap-1">
        <CalendarDays className="w-4 h-4" />
        {/* <Label>{t("createdAt")}:</Label> */}
        {fullDateFormatter.format(transaction.createdAt)}
      </div>
      {transaction.deletedAt && (
        <div className="flex flex-row text-destructive items-center gap-1">
          <CalendarDays className="w-4 h-4 " />
          {t("deletedAt")}
        </div>
      )}
      {transaction.deletedAt && (
        <div className="flex flex-row text-destructive items-center gap-1">
          <Trash2 className="w-4 h-4 " />
          {/* <Label>{t("createdAt")}:</Label> */}
          {fullDateFormatter.format(transaction.deletedAt)}
        </div>
      )}
      <div className="col-span-full flex flex-row items-center gap-1">
        <Library className="w-4 h-4" />
        <Label>{t("observation")}</Label>
      </div>

      <div className="col-span-full">{transaction.observation ?? "N/A"}</div>
      <Separator className="col-span-full" />
      <div className="col-span-full ml-auto flex flex-row gap-4">
        <Button
          onClick={() => {
            window.open(`/api/pdfs/receipts?id=${transaction.id}`, "_blank");
            closeModal();
          }}
          size={"icon"}
          variant={"outline"}
        >
          <Printer className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            closeModal();
          }}
          variant={"default"}
        >
          <X className="mr-2 h-4 w-4 stroke-1" />
          {t("close")}
        </Button>
      </div>
    </div>
  );
}
