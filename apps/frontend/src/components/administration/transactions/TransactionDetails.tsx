"use client";

import { notFound } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useModal } from "@/hooks/use-modal";
import { api } from "@/trpc/react";
import { useDateFormat } from "@/utils/date-format";
import { Button } from "@repo/ui/button";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
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
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { getFullName } from "../../../utils/full-name";
import { useMoneyFormat } from "../../../utils/money-format";

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
    throw transactionQuery.error;
  }
  const transaction = transactionQuery.data;
  return (
    <div className="grid gap-3 text-sm md:grid-cols-2">
      <div className="flex flex-row items-center gap-1">
        <Badge className="stroke-1" />
        <Label>{t("account")}:</Label>
        {transactionQuery.data?.account?.name}
      </div>
      <div className="flex flex-row items-center gap-1">
        <User className="stroke-1" />
        <Label>{t("student")}:</Label>
        <span className="overflow-hidden truncate">
          {getFullName(transactionQuery.data.account?.student)}
        </span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <DollarSign className="stroke-1" />
        <Label>{t("amount")}:</Label>
        {moneyFormatter.format(transactionQuery.data.amount)}
      </div>
      <div className="flex flex-row items-center gap-1">
        <File className="stroke-1" />
        <Label>{t("description")}:</Label>
        <span className="overflow-hidden truncate">
          {transactionQuery.data.description}
        </span>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Clock className="stroke-1" />
        <Label>{t("status")}:</Label>
        <FlatBadge
          variant={
            transactionQuery.data.status == "VALIDATED"
              ? "green"
              : transactionQuery.data.status == "CANCELLED"
                ? "red"
                : "yellow"
          }
        >
          {transactionQuery.data.status &&
            t(transactionQuery.data.status?.toLowerCase())}
        </FlatBadge>
      </div>
      <div className="flex flex-row items-center gap-1">
        <FileSliders className="stroke-1" />
        <Label>{t("transactionRef")}:</Label>
        {transaction.transactionRef}
      </div>
      <div className="flex flex-row items-center gap-1">
        <AlignStartHorizontal className="stroke-1" />
        <Label>{t("transactionType")}:</Label>
        {transaction.transactionType}
      </div>
      <div className="flex flex-row items-center gap-1">
        <CalendarDays className="stroke-1" />
        <Label>{t("createdAt")}:</Label>
        {transaction.createdAt &&
          fullDateFormatter.format(transaction.createdAt)}
      </div>
      <div className="col-span-full flex flex-row items-center gap-1">
        <Library className="stroke-1" />
        <Label>{t("observation")}</Label>
      </div>
      <div className="col-span-full">{transaction.observation || "N/A"}</div>
      <Separator className="col-span-full" />
      <div className="col-span-full ml-auto flex flex-row gap-4">
        <Button
          onClick={() => {
            toast.warning("Not implemented yet"); // TODO: Implement print
            //closeModal();
          }}
          size={"icon"}
          variant={"outline"}
        >
          <Printer className="h-4 w-4 stroke-1" />
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
