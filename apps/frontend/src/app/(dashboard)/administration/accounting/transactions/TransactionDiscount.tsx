"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { DiscountDataTable } from "~/components/administration/transactions/DiscountDataTable";
import FlatBadge from "~/components/FlatBadge";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionDiscount() {
  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const locale = useLocale();
  const trpc = useTRPC();
  const t = useTranslations();

  const transactionsQuery = useQuery(
    trpc.transaction.all.queryOptions({
      status: searchParams.status ?? undefined,
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId ?? undefined,
      journalId: searchParams.journalId ?? undefined,
      transactionType: "DISCOUNT",
    }),
  );

  const transactions = transactionsQuery.data ?? [];
  const moneyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const totals = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const validated = transactions.reduce(
    (acc, curr) => acc + (curr.status == "VALIDATED" ? curr.amount : 0),
    0,
  );
  const canceled = transactions.reduce(
    (acc, curr) => acc + (curr.status == "CANCELED" ? curr.amount : 0),
    0,
  );
  const pending = transactions.reduce(
    (acc, curr) => acc + (curr.status == "PENDING" ? curr.amount : 0),
    0,
  );

  return (
    <div className="flex flex-col">
      <div className="grid flex-row items-center gap-4 py-2 md:flex">
        <FlatBadge variant={"indigo"}>
          {t("totals")} : {moneyFormatter.format(totals)}
        </FlatBadge>
        <FlatBadge variant={"green"}>
          {t("validated")} : {moneyFormatter.format(validated)}
        </FlatBadge>
        <FlatBadge variant={"blue"}>
          {t("pending")} : {moneyFormatter.format(pending)}
        </FlatBadge>
        <FlatBadge variant={"red"}>
          {t("canceled")} : {moneyFormatter.format(canceled)}
        </FlatBadge>
      </div>
      <DiscountDataTable transactions={transactions} />
    </div>
  );
}
