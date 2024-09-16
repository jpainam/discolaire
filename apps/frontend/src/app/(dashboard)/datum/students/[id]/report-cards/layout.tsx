import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { ReportCardHeader } from "~/components/students/report-cards/ReportCardHeader";
import { api } from "~/trpc/server";

export default async function Layout({
  params: { id },
  children,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const classroom = await api.student.classroom(id);
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  return (
    <div className="flex w-full flex-col">
      <ReportCardHeader />
      {children}
    </div>
  );
}
