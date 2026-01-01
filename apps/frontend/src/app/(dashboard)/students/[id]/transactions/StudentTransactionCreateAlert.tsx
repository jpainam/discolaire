"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function StudentTransactionCreateAlert() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const locale = useLocale();
  const trpc = useTRPC();

  const { data: unpaidRequiredFees } = useSuspenseQuery(
    trpc.student.unpaidRequiredFees.queryOptions(params.id),
  );
  return (
    <>
      {unpaidRequiredFees.unpaid !== 0 && (
        <div className="mx-auto flex w-full max-w-3xl">
          <Alert
            className={cn(
              "border-amber-500/50 bg-amber-500/10 text-amber-600",
              "dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              <div>
                {t("required_fees")} {unpaidRequiredFees.journal}
              </div>
            </AlertTitle>

            <AlertDescription className="flex items-center justify-between gap-2">
              {t("required_fee_warning")}
              <div className="ml-auto font-bold tracking-tight">
                {unpaidRequiredFees.unpaid.toLocaleString(locale, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
