import type { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { api } from "~/trpc/server";
import { PrintAction } from "./PrintAction";
import { TransactionTabMenu } from "./TransactionTabMenu";

export default async function Layout({
  children,
  params: { id },
}: PropsWithChildren<{ params: { id: string } }>) {
  const classroom = await api.student.classroom({ studentId: id });
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between border-b py-1 pr-2">
        <TransactionTabMenu />
        <PrintAction />
      </div>
      {children}
    </div>
  );
}
