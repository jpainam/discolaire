"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

export function TransactionSummaryPerDay() {
  const trpc = useTRPC();
  const { data: summary } = useSuspenseQuery(
    trpc.transaction.getLastDaysDailySummary.queryOptions({
      number_of_days: 60,
    }),
  );
  const t = useTranslations();
  const locale = useLocale();
  return (
    <div className="border-l">
      <div className="bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>{t("pending")}</TableHead>
              <TableHead>{t("validated")}</TableHead>
              <TableHead>{t("deleted")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.map((s, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(s.date).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell>
                    {s.pending.toLocaleString(locale, {
                      currency: CURRENCY,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    {s.validated.toLocaleString(locale, {
                      currency: CURRENCY,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    {s.deleted.toLocaleString(locale, {
                      currency: CURRENCY,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
