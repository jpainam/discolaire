"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlignStartHorizontal,
  Banknote,
  CalendarDays,
  Clock,
  File,
  FileSliders,
  Library,
  Loader,
  Printer,
  Trash2,
  UserSquare,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { UserLink } from "~/components/UserLink";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function TransactionDetails({
  transactionId,
}: {
  transactionId: number;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const { closeModal } = useModal();
  const trpc = useTRPC();

  const transactionQuery = useQuery(
    trpc.transaction.get.queryOptions(transactionId),
  );

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
    <div className="grid grid-cols-1 gap-4">
      <UserLink
        profile="student"
        id={transaction.studentId}
        name={getFullName(transaction.student)}
      />
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div className="flex flex-row items-center gap-1">
          <UserSquare className="h-4 w-4" />
          {/* <Label>{t("student")}:</Label> */}
          <span>{t("created_by")}</span>
          <span className="truncate overflow-hidden">
            {transaction.createdBy?.name}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Banknote className="h-4 w-4" />
          {/* <Label>{t("amount")}:</Label> */}
          {transactionQuery.data.amount.toLocaleString(locale, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: "CFA",
            style: "currency",
          })}
        </div>
        <div className="flex flex-row items-center gap-1">
          <File className="h-4 w-4" />
          {/* <Label>{t("description")}:</Label> */}
          <span className="truncate overflow-hidden">
            {transactionQuery.data.description}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Clock className="h-4 w-4" />
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
        <Link
          href={`/students/${transaction.studentId}/transactions/${transaction.id}`}
          className="flex flex-row items-center gap-1 hover:underline"
        >
          <FileSliders className="h-4 w-4" />
          {/* <Label>{t("transactionRef")}:</Label> */}
          {transaction.transactionRef}
        </Link>
        <div className="flex flex-row items-center gap-1">
          <AlignStartHorizontal className="h-4 w-4" />
          {/* <Label>{t("transactionType")}:</Label> */}
          {transaction.transactionType}
        </div>
        <div className="flex flex-row items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {/* <Label>{t("createdAt")}:</Label> */}
          {transaction.createdAt.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
        {transaction.deletedAt && (
          <div className="text-destructive flex flex-row items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {t("deletedAt")}
          </div>
        )}
        {transaction.deletedAt && (
          <div className="text-destructive flex flex-row items-center gap-1">
            <Trash2 className="h-4 w-4" />
            {/* <Label>{t("createdAt")}:</Label> */}
            {transaction.deletedAt.toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
        <div className="col-span-full flex flex-row items-center gap-1">
          <Library className="h-4 w-4" />
          <Label>{t("observation")}</Label>
        </div>

        <div className="col-span-full">{transaction.observation ?? "N/A"}</div>

        <div className="col-span-full ml-auto flex flex-row gap-4">
          <Button
            onClick={() => {
              window.open(`/api/pdfs/receipts?id=${transaction.id}`, "_blank");
              closeModal();
            }}
            size={"icon"}
            variant={"outline"}
          >
            <Printer />
          </Button>
          <Button
            onClick={() => {
              closeModal();
            }}
            variant={"default"}
          >
            {t("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
