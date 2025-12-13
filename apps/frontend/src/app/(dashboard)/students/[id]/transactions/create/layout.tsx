import type { PropsWithChildren } from "react";
import { AlertTriangle, CircleDollarSign } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { caller } from "~/trpc/server";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const params = await props.params;
  const t = await getTranslations();
  const locale = await getLocale();
  const classroom = await caller.student.classroom({ studentId: params.id });
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }

  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(params.id);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="bg-secondary text-secondary-foreground flex items-center gap-2 border-b px-2 py-2">
        <CircleDollarSign className="h-4 w-4" />
        <Label className="py-1.5"> {t("make_payment")}</Label>
      </div>

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
      {props.children}
    </div>
  );
}
