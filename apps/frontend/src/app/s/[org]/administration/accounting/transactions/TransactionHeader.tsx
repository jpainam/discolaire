/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { useQueryStates } from "nuqs";

import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionHeader() {
  const trpc = useTRPC();

  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  // const { data: transactions } = useSuspenseQuery(
  //   trpc.transaction.all.queryOptions({
  //     status: searchParams.status ?? undefined,
  //     from: searchParams.from ?? undefined,
  //     to: searchParams.to ?? undefined,
  //     classroomId: searchParams.classroomId ?? undefined,
  //     journalId: searchParams.journalId ?? undefined,
  //   }),
  // );

  const { data: stats, isPending } = useSuspenseQuery(
    trpc.transaction.stats.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  );

  const { t } = useLocale();

  const { school } = useSchool();
  const moneyFormatter = new Intl.NumberFormat(i18next.language, {
    style: "currency",
    currency: school.currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return (
    <div className="grid flex-row items-center gap-4 py-2 md:flex">
      {stats && !isPending ? (
        <>
          <FlatBadge variant={"indigo"}>
            {t("totals")} :{" "}
            {moneyFormatter.format(
              stats.totalCompleted + stats.totalInProgress,
            )}
          </FlatBadge>

          <FlatBadge variant={"green"}>
            {t("validated")} : {moneyFormatter.format(stats.totalCompleted)}
          </FlatBadge>
          <FlatBadge variant={"blue"}>
            {t("pending")} : {moneyFormatter.format(stats.totalInProgress)}
          </FlatBadge>
          <FlatBadge variant={"red"}>
            {t("deleted")} : {moneyFormatter.format(stats.totalDeleted)}
          </FlatBadge>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
