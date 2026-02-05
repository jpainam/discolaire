"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

export function StatCards({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const { data: stat } = useSuspenseQuery(
    trpc.contact.stats.queryOptions(contactId),
  );
  const locale = useLocale();
  const stats = useMemo(() => {
    return [
      {
        title: "students",
        value: stat.students,
        bg: "bg-zinc-950",
      },
      {
        title: "balance",
        value: stat.balance.toLocaleString(locale, {
          style: "currency",
          currency: CURRENCY,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }),
        bg: "bg-fuchsia-600",
      },
      {
        title: "grades",
        value: stat.grade,
        bg: "bg-blue-600",
      },
      {
        title: "activities",
        value: 0,
        bg: "bg-teal-600",
      },
    ];
  }, [stat, locale]);
  const t = useTranslations();
  return (
    <div className="grid grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden ${stat.bg} text-white`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/90">
              {t(stat.title)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
