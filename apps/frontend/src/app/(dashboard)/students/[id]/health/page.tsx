import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  const { t } = await getServerTranslations();
  if (!student.userId) {
    return <EmptyState className="py-8" title={t("no_user_attached_yet")} />;
  }
  return (
    <div className="flex w-full flex-col">
      <HealthVisitHeader />
      <HealthVisitTable userId={student.userId} />
    </div>
  );
}
