"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Label } from "@repo/ui/components/label";

import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function AnnouncementSummary() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const announcementsQuery = useQuery(trpc.announcement.all.queryOptions());
  const [activeNotices, setActiveNotices] = useState(0);
  const [futureNotices, setFutureNotices] = useState(0);
  const [expiredNotices, setExpiredNotices] = useState(0);

  useEffect(() => {
    if (!announcementsQuery.data) return;
    const noticeboards = announcementsQuery.data;
    const now = new Date();
    setActiveNotices(
      noticeboards.filter(
        (nb) => new Date(nb.from) <= now && now <= new Date(nb.to),
      ).length,
    );
    setFutureNotices(
      noticeboards.filter((nb) => new Date(nb.from) > now).length,
    );
    setExpiredNotices(
      noticeboards.filter((nb) => new Date(nb.to) < now).length,
    );
  }, [announcementsQuery.data]);

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
