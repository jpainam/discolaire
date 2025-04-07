"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { useSearchParams } from "next/navigation";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";

export function TransactionHeader() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const classroom = searchParams.get("classroom");
  const { data: transactions } = useSuspenseQuery(
    trpc.transaction.all.queryOptions({
      status: status ?? undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      classroomId: classroom ?? undefined,
    })
  );
  const { t } = useLocale();
  const totals = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const validated = transactions.reduce(
    (acc, curr) => acc + (curr.status == "VALIDATED" ? curr.amount : 0),
    0
  );
  const canceled = transactions.reduce(
    (acc, curr) => acc + (curr.status == "CANCELED" ? curr.amount : 0),
    0
  );
  const pending = transactions.reduce(
    (acc, curr) => acc + (curr.status == "PENDING" ? curr.amount : 0),
    0
  );
  const { school } = useSchool();
  const moneyFormatter = new Intl.NumberFormat(i18next.language, {
    style: "currency",
    currency: school.currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return (
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
  );
}
