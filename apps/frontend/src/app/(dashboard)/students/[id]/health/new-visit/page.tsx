import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  const { t } = await getServerTranslations();
  if (!student.userId) {
    return <EmptyState className="py-8" title={t("no_user_attached_yet")} />;
  }

  return <CreateEditHealthVisit userId={student.userId} />;
}
