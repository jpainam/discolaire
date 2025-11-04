import { getLocale, getTranslations } from "next-intl/server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { CURRENCY } from "~/lib/constants";
import { getQueryClient, trpc } from "~/trpc/server";

export async function TransactionSummaryPerDay() {
  const queryClient = getQueryClient();
  const summary = await queryClient.fetchQuery(
    trpc.transaction.getLastDaysDailySummary.queryOptions({
      number_of_days: 60,
    }),
  );
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <div className="max-h-[calc(100vh-200px)] border-l">
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
