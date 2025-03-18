/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { useRouter } from "~/hooks/use-router";
import { useMoneyFormat } from "~/utils/money-format";

export function RequiredFeeHeader({
  transactions,
}: {
  transactions?: RouterOutputs["transaction"]["all"];
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { moneyFormatter } = useMoneyFormat();
  const { createQueryString } = useCreateQueryString();
  const [totals] = useState(0);
  const [validated] = useState(0);
  const [canceled, setCancelled] = useState(0);
  return (
    <div className="grid flex-row items-center gap-2 px-4 py-2 md:flex">
      <FlatBadge variant={"indigo"}>
        {t("totals")} : {moneyFormatter.format(totals)}
      </FlatBadge>
      <FlatBadge variant={"green"}>
        {t("validated")} : {moneyFormatter.format(validated)}
      </FlatBadge>
      <FlatBadge variant={"red"}>
        {t("canceled")} : {moneyFormatter.format(canceled)}
      </FlatBadge>
    </div>
  );
}
