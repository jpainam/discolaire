"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { DeletedTransactionDataTable } from "~/components/administration/transactions/DeletedDataTable";
import FlatBadge from "~/components/FlatBadge";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function DeleteTransactionList() {
  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const t = useTranslations();
  const locale = useLocale();

  const { school } = useSchool();

  const trpc = useTRPC();
  const transactionQuery = useQuery(
    trpc.transaction.getDeleted.queryOptions({
      status: searchParams.status ?? undefined,
      from: searchParams.from ? new Date(searchParams.from) : undefined,
      to: searchParams.to ? new Date(searchParams.to) : undefined,
      classroom: searchParams.classroomId ?? undefined,
    }),
  );
  const transactions = transactionQuery.data ?? [];

  const totals = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex flex-col">
      <div className="grid flex-row items-center gap-4 py-2 md:flex">
        <FlatBadge variant={"green"}>
          {t("totals")} :{" "}
          {totals.toLocaleString(locale, {
            style: "currency",
            currency: school.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </FlatBadge>
        <FlatBadge variant={"red"}>
          {t("deleted")} : {transactions.length}
        </FlatBadge>
      </div>
      <DeletedTransactionDataTable transactions={transactions} />
    </div>
  );
}
