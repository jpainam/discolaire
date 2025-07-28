import type { PropsWithChildren } from "react";
import { CircleDollarSign } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Label } from "@repo/ui/components/label";

import { AlertState } from "~/components/AlertState";
import { EmptyState } from "~/components/EmptyState";
import { caller } from "~/trpc/server";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const params = await props.params;
  const t = await getTranslations();
  const classroom = await caller.student.classroom({ studentId: params.id });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }

  const unpaidRequiredFees = await caller.student.unpaidRequiredFees(params.id);
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="bg-secondary text-secondary-foreground flex items-center gap-2 border-b px-2 py-2">
        <CircleDollarSign className="h-4 w-4" />
        <Label className="py-1.5"> {t("make_payment")}</Label>
      </div>

      {unpaidRequiredFees.length !== 0 && (
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          <AlertState variant="warning">{t("required_fee_warning")}</AlertState>
        </div>
      )}
      {props.children}
    </div>
  );
}
