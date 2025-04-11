import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";
import { HealthDocumentTable } from "./DocumentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  const { t } = await getServerTranslations();
  // if (!student.userId) {
  //   return <EmptyState className="py-8" title={t("no_user_attached_yet")} />;
  // }
  const documents = await caller.health.documents({
    userId: student.userId ?? "N/A",
  });
  if (!documents.length) {
    return (
      <EmptyState className="py-8" title={t("no_health_documents_found")} />
    );
  }
  return (
    <div>
      <HealthDocumentTable />
    </div>
  );
}
