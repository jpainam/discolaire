import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { getQueryClient, trpc } from "~/trpc/server";
import { HealthDocumentTable } from "./DocumentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );

  const t = await getTranslations();
  if (!student.userId) {
    return <EmptyComponent title={t("no_health_documents_found")} />;
  }
  const documents = await queryClient.fetchQuery(
    trpc.health.documents.queryOptions({
      userId: student.userId,
    }),
  );
  if (!documents.length) {
    return <EmptyComponent title={t("no_health_documents_found")} />;
  }

  return (
    <div>
      <HealthDocumentTable />
    </div>
  );
}
