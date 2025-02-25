import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { api } from "~/trpc/server";
import { DocumentGrid } from "./DocumentGrid";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  const { t } = await getServerTranslations();
  if (!student.userId) {
    return (
      <EmptyState
        className="py-8"
        title={t("no_user_attached_to_the_student")}
      />
    );
  }
  const documents = await api.health.documents({ userId: student.userId });
  if (!documents.length) {
    return (
      <EmptyState className="py-8" title={t("no_health_documents_found")} />
    );
  }
  return (
    <div>
      <DocumentGrid />
    </div>
  );
}
