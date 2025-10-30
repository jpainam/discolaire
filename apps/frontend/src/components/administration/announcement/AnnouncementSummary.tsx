"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Label } from "@repo/ui/components/label";

import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function AnnouncementSummary() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: noticeboards } = useSuspenseQuery(
    trpc.announcement.all.queryOptions(),
  );
  const [today] = useState(() => new Date());

  const activeNotices = noticeboards.filter(
    (nb) => new Date(nb.from) <= today && today <= new Date(nb.to),
  ).length;

  const futureNotices = noticeboards.filter(
    (nb) => new Date(nb.from) > today,
  ).length;

  const expiredNotices = noticeboards.filter(
    (nb) => new Date(nb.to) < today,
  ).length;
  return (
    <>
      <Label>{t("Notice Summary")}:</Label>
      <FlatBadge variant={"green"}>
        {t("active")} : {activeNotices}
      </FlatBadge>
      <FlatBadge variant={"yellow"}>
        {t("future")} : {futureNotices}
      </FlatBadge>
      <FlatBadge variant={"red"}>
        {t("expires")} : {expiredNotices}
      </FlatBadge>
    </>
  );
}
